# Saga Pattern Plan — Premium Post Purchase

**Stack**: Turborepo · NestJS · Apollo Federation v2 · Prisma · Postgres · **BullMQ (Redis)** · OpenTelemetry · Jaeger

**Saga style**: Orchestration (central `saga-orchestrator` service drives a finite-state machine)

**Use case**: A buyer purchases access to a premium post. The workflow touches reservation, wallet, payment, entitlement, and notification — each in a different service, each with its own DB, each able to fail. The saga guarantees that either all of them commit or each completed step is compensated.

---

## 1. Target domain

### New business operation

```
mutation purchasePremiumPost(postId: Int!, buyerUserId: Int!): SagaHandle
```

Returns a `sagaId` immediately; the workflow runs asynchronously and is observable through `query saga(sagaId)`.

### Happy-path steps (forward transactions)

| # | Service                 | Action                                    | Local write                                                  |
|---|-------------------------|-------------------------------------------|--------------------------------------------------------------|
| 1 | `posts-service`         | `reservePost`                             | Insert `PostReservation(postId, buyerUserId, sagaId, expiresAt)` |
| 2 | `users-service`         | `debitWallet`                             | Decrement `Wallet.balanceCents`, insert `WalletTransaction`  |
| 3 | `payments-service`      | `chargePayment` (mock external gateway)   | Insert `Payment(status=CAPTURED)`                            |
| 4 | `entitlements-service`  | `grantEntitlement`                        | Insert `Entitlement(userId, postId, source=PURCHASE)`        |
| 5 | `notifications-service` | `sendPurchaseConfirmation`                | Insert `Notification(channel=EMAIL, status=QUEUED)`          |

### Compensations (reverse order on failure)

| Forward step | Compensation              | Effect                                              |
|--------------|---------------------------|-----------------------------------------------------|
| 5            | `cancelNotification`      | Mark notification CANCELED (or skip if already sent — idempotent) |
| 4            | `revokeEntitlement`       | Soft-delete entitlement                             |
| 3            | `refundPayment`           | Insert refund record, flip Payment status REFUNDED  |
| 2            | `creditWallet`            | Re-credit buyer, insert reversing `WalletTransaction` |
| 1            | `releaseReservation`      | Mark reservation CANCELED                           |

Compensations must be **semantic undos**, not raw deletes — they leave an audit trail.

---

## 2. New services and schema changes

### New services (NestJS + Prisma, each with its own Postgres DB)

- **`payments-service`** — `Payment`, `Refund`. Simulates a Stripe-like gateway with an injectable failure rate (env-controlled) so you can exercise the rollback path.
- **`entitlements-service`** — `Entitlement(id, userId, postId, source, grantedAt, revokedAt?)`. The single source of truth for "can this user read this premium post?".
- **`notifications-service`** — `Notification(id, userId, channel, payload, status)`. No real email sending; just a status table you can inspect.
- **`saga-orchestrator`** — Owns `Saga` and `SagaStep` tables, exposes the GraphQL mutation, runs the FSM workers.

### Changes to existing services

**`posts-service`**

```prisma
model Post {
  id          Int      @id @default(autoincrement())
  userId      Int
  title       String
  body        String
  isPremium   Boolean  @default(false)   // NEW
  priceCents  Int?                       // NEW (required when isPremium)
  publishedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PostReservation {                  // NEW
  id           Int       @id @default(autoincrement())
  postId       Int
  buyerUserId  Int
  sagaId       String
  status       String    // RESERVED | CONFIRMED | CANCELED
  expiresAt    DateTime
  createdAt    DateTime  @default(now())
  @@unique([postId, buyerUserId, status])  // one live reservation per (post, buyer)
}
```

**`users-service`**

```prisma
model Wallet {                           // NEW
  id           Int       @id @default(autoincrement())
  userId       Int       @unique
  balanceCents Int       @default(0)
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model WalletTransaction {                // NEW
  id          Int      @id @default(autoincrement())
  walletId    Int
  amountCents Int      // negative for debits, positive for credits
  type        String   // DEBIT | CREDIT | REVERSAL
  sagaId      String
  createdAt   DateTime @default(now())
  @@index([sagaId])
}
```

### Saga-infra tables (in **every** service that participates)

```prisma
model OutboxEvent {
  id            BigInt   @id @default(autoincrement())
  aggregateType String
  aggregateId   String
  eventType     String
  payload       Json
  sagaId        String
  createdAt     DateTime @default(now())
  publishedAt   DateTime?
  @@index([publishedAt])
}

model ProcessedMessage {
  sagaId    String
  stepName  String
  processedAt DateTime @default(now())
  @@id([sagaId, stepName])
}
```

### Orchestrator tables

```prisma
model Saga {
  id          String      @id          // UUID, also used as correlationId
  type        String                    // "PURCHASE_PREMIUM_POST"
  status      String                    // PENDING | RUNNING | COMPENSATING | COMPLETED | FAILED
  payload     Json                      // { postId, buyerUserId, priceCents }
  currentStep String?
  startedAt   DateTime    @default(now())
  endedAt     DateTime?
  steps       SagaStep[]
}

model SagaStep {
  id           BigInt   @id @default(autoincrement())
  sagaId       String
  name         String                   // "DEBIT_WALLET" etc.
  direction    String                   // FORWARD | COMPENSATE
  status       String                   // PENDING | OK | FAILED | SKIPPED
  attempt      Int      @default(0)
  request      Json
  response     Json?
  error        String?
  startedAt    DateTime @default(now())
  endedAt      DateTime?
  saga         Saga     @relation(fields: [sagaId], references: [id])
  @@index([sagaId])
}
```

---

## 3. How BullMQ wires it together

```
                           ┌────────────────────────────────────────┐
   GraphQL mutation ─────► │   saga-orchestrator                    │
                           │                                        │
                           │   POST  → INSERT Saga + first SagaStep │
                           │   ENQUEUE  step.reserve_post           │
                           └──────────────┬─────────────────────────┘
                                          │
                ┌─────────────────────────┴────────────────────────┐
                │                Redis (BullMQ)                    │
                │  Queues:                                         │
                │    step.reserve_post       (consumer: posts)     │
                │    step.debit_wallet       (consumer: users)     │
                │    step.charge_payment     (consumer: payments)  │
                │    step.grant_entitlement  (consumer: entitlmts) │
                │    step.send_notification  (consumer: notifs)    │
                │    compensate.<step>       (per step, same svc)  │
                │    saga.events             (consumer: orch)      │
                │    *.dlq                   (one DLQ per queue)   │
                └─────────────────────────┬────────────────────────┘
                                          │
                          Each service has a BullMQ Worker
                          that processes its step queue and
                          PUBLISHES a result event back to
                          `saga.events` via its outbox relay.
```

### Inside a participating service

For every saga step a service owns, the worker:

1. Begins a Prisma transaction.
2. Checks `ProcessedMessage` for `(sagaId, stepName)` — if present, return cached success (idempotent retry).
3. Performs the business write (e.g., debit wallet) — fails fast if invariants are violated (insufficient funds).
4. Inserts an `OutboxEvent` row with `{ sagaId, stepName, status, payload }`.
5. Inserts a `ProcessedMessage` row.
6. Commits.
7. A separate **outbox relay** (a BullMQ repeating job inside the same process, every ~250 ms) polls unpublished outbox rows, enqueues them onto `saga.events`, marks them published.

This is the **transactional outbox** pattern — the business write and the "event was produced" fact share one ACID boundary, so events can never be lost even if the process dies between write and publish.

### Inside the orchestrator

A worker on `saga.events`:

1. Loads the `Saga` row.
2. Updates the matching `SagaStep` to OK/FAILED with response payload.
3. **If OK and there is a next forward step**: insert next `SagaStep`, enqueue it on its queue.
4. **If OK and that was the last step**: mark saga `COMPLETED`.
5. **If FAILED and saga is `RUNNING`**: flip saga to `COMPENSATING`, enumerate already-completed forward steps in reverse, enqueue their compensations one by one.
6. **If FAILED during compensation**: mark saga `FAILED` (with a flag indicating dirty state — manual intervention needed; surface in the saga query for an operator).

### Retry / DLQ

Each step queue is created with:

```ts
defaultJobOptions: {
  attempts: 5,
  backoff: { type: 'exponential', delay: 500 },
  removeOnComplete: 1000,
  removeOnFail: false,
}
```

A queue-level `failed` listener moves jobs that exhaust attempts to `<queue>.dlq`. The orchestrator treats a DLQ landing as a step failure → triggers compensation.

---

## 4. Shared packages to add

Under `packages/`:

- **`@repo/saga-contracts`** — TypeScript types for every step's request/response payload, queue name constants, saga state enum. Imported by orchestrator + every participant so payloads stay in sync.
- **`@repo/saga-sdk`** — Reusable building blocks:
  - `OutboxRelay` (BullMQ producer + Prisma polling)
  - `IdempotentStepHandler<TIn, TOut>` base class (wraps the txn + dedup + outbox pattern shown above)
  - `BullMQOTelInstrumentation` (auto-injects/extracts trace context from job data)
  - `dlqRouter(queue)` helper
- **`@repo/observability`** — OTel SDK bootstrap (OTLP HTTP exporter to Jaeger), `withCorrelationId(sagaId)` AsyncLocalStorage helper, NestJS interceptor.

Centralizing these means each service's saga code is ~50 lines, not 500.

---

## 5. Local infrastructure (docker-compose)

Add a `docker-compose.yml` at the repo root with:

- Redis 7 (BullMQ broker) — single instance, no cluster
- Jaeger all-in-one (OTLP HTTP receiver on 4318, UI on 16686)
- Optional: redis-commander for queue inspection
- Optional: Postgres-per-service if you aren't already using one shared cluster

A `turbo run dev` command should bring up all 7 services in parallel (5 backend + orchestrator + frontends) after `docker compose up -d`.

> Side note: `package.json#start-services` script references `products-service, orders-service` which don't exist — worth fixing while you're in there.

---

## 6. Observability wiring

- The orchestrator generates `sagaId = randomUUID()` and uses it as both the saga primary key and the OpenTelemetry `correlationId`.
- Every BullMQ job carries `data.traceContext` (W3C `traceparent` + `tracestate`) injected via `propagation.inject(context.active(), …)` in the SDK.
- Workers `propagation.extract` on receipt and run their handler inside that context, so spans across services chain into one trace in Jaeger.
- Custom span attributes on every span: `saga.id`, `saga.type`, `saga.step`, `saga.direction`. Makes it possible to filter Jaeger by a single saga.
- Add a structured-log field `sagaId=` to every NestJS logger output via a Pino middleware reading AsyncLocalStorage.

---

## 7. Failure scenarios to demo

Drive these from a small CLI or a `scripts/saga-demo.ts`:

1. **Happy path** — all five steps succeed, saga `COMPLETED`.
2. **Insufficient funds** — step 2 fails synchronously, compensation = release reservation only.
3. **Payment gateway times out** — payments-service exhausts retries, lands in DLQ, orchestrator compensates wallet + reservation.
4. **Entitlement DB unique violation** (simulating already-granted) — treated as success (idempotent), saga proceeds.
5. **Notification fails after entitlement** — entitlement is revoked, payment refunded, wallet credited, reservation released. End-to-end rollback.
6. **Orchestrator crash mid-saga** — kill the orchestrator after step 3 succeeds; on restart it picks up the `RUNNING` saga from the DB (boot-time recovery scans `Saga` where `status IN ('RUNNING','COMPENSATING')` and re-enqueues from `currentStep`).

Each scenario should have a Jest e2e test that asserts terminal saga state and the audit trail in `SagaStep`.

---

## 8. Frontend touchpoints

In `apps/blogs`:

- A "Buy" button on premium posts.
- A `useSaga(sagaId)` hook that polls `saga(sagaId)` every 1 s until terminal state (or upgrade to a GraphQL subscription via the orchestrator later).
- A small saga-progress component that renders the step list with status badges — turns the saga into something a non-engineer can demo.

---

## 9. Suggested build order

| Phase | Scope | Why first |
|-------|-------|-----------|
| **0** | Add Redis + Jaeger to docker-compose. Add `@repo/saga-contracts`, `@repo/saga-sdk`, `@repo/observability` skeletons. | Everything downstream depends on these. |
| **1** | Scaffold `saga-orchestrator` with `Saga` + `SagaStep` tables, GraphQL mutation that just inserts a Saga and returns the id (no workers yet). | Establishes the public API and DB shape. |
| **2** | Add `Wallet` + premium fields to existing services. Migrations + seed (give every user $100 of credit, mark some posts premium). | Smallest schema delta; unblocks step handlers. |
| **3** | Scaffold `payments-service`, `entitlements-service`, `notifications-service` with bare CRUD + outbox + dedup tables. No saga logic yet. | Get the new services federated and healthy in isolation. |
| **4** | Implement step handlers in each service + outbox relay + idempotency. Wire up `step.*` queues. | Forward path of the saga starts working. |
| **5** | Implement orchestrator workers — saga.events consumer, FSM, next-step dispatch, compensation chain. | End-to-end happy path lights up here. |
| **6** | Compensation handlers in each service. DLQ routing. Orchestrator restart-recovery. | Failure paths covered. |
| **7** | OTel SDK init across services, trace-context propagation in BullMQ jobs, Jaeger validation. | Observability layered on once flows are stable. |
| **8** | Frontend Buy button + saga progress widget. E2E demo scripts + Jest tests for the 6 scenarios. | Demoable end-product. |

---

## 10. Open questions worth resolving before you start coding

1. **Wallet location** — keep wallet inside `users-service` (current plan) or split into a dedicated `wallet-service` for cleaner boundary? Splitting adds another service-hop and another DB but makes the saga touch one more boundary, which is more pedagogically interesting.
2. **Reservation TTL** — should an orphaned `PostReservation` expire automatically (cleanup job) or only via compensation? Pick one to avoid double-cleanup races.
3. **Premium post sales — single-buy or N copies?** Single-buy (unique entitlement per `(userId, postId)`) is simpler and what the plan assumes. If you allow re-purchase / gifting, the entitlement model changes.
4. **Auth** — none of the services currently authenticate. Do you want to add a minimal JWT layer so `buyerUserId` isn't trusted from the client, or leave that out of scope for the saga work?

Answer these and I can turn this into concrete migrations and code in the order in Section 9.
