# GraphQL Federation Monorepo

A full-stack Turborepo monorepo featuring Apollo Federation v2, three NestJS subgraph services, Next.js microfrontends, and a shared component library.

## Architecture

```
Browser / Next.js apps (users, blogs)
        │
        ▼
Apollo Router :4000  (supergraph gateway — run via `rover dev`)
        │
        ├── users-service    :4001  (NestJS subgraph)  ──┐
        ├── posts-service    :4002  (NestJS subgraph)  ──┼── postgres :5432 (users_db / posts_db / comments_db)
        └── comments-service :4003  (NestJS subgraph)  ──┘
```

## Apps and Packages

| Name | Type | Description |
|---|---|---|
| `users-service` | NestJS + GraphQL | Federation subgraph — users, addresses, companies |
| `posts-service` | NestJS + GraphQL | Federation subgraph — posts with federated author |
| `comments-service` | NestJS + GraphQL | Federation subgraph — comments linked to posts |
| `users` | Next.js | Microfrontend — user-facing UI |
| `blogs` | Next.js | Microfrontend — blog UI |
| `@repo/ui` | React library | Shared component library |
| `@repo/graphql-types` | codegen | Shared GraphQL types via `@graphql-codegen/cli` |
| `@repo/eslint-config` | config | Shared ESLint configuration |
| `@repo/typescript-config` | config | Shared `tsconfig.json` |

## Quick Start

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- [Apollo Rover CLI](https://www.apollographql.com/docs/rover/getting-started)

```bash
curl -sSL https://rover.apollo.dev/nix/latest | sh
```

### Option A — Full Docker stack

Runs all services and a single Postgres instance with all three databases:

```bash
docker compose up --build
```

Then start the supergraph router locally:

```bash
rover dev --supergraph-config supergraph.yaml --supergraph-port 4000
```

Apollo Sandbox: **http://localhost:4000**

### Option B — Local dev (services outside Docker)

**1. Start the database**

```bash
docker compose up postgres
```

**2. Install dependencies**

```bash
npm install
```

**3. Copy env files and run migrations**

```bash
# users-service
cp apps/users-service/.env.example apps/users-service/.env
cd apps/users-service && npx prisma migrate dev --name init && npm run prisma:seed && cd ../..

# posts-service
cp apps/posts-service/.env.example apps/posts-service/.env
cd apps/posts-service && npx prisma migrate dev --name init && npm run prisma:seed && cd ../..

# comments-service
cp apps/comments-service/.env.example apps/comments-service/.env
cd apps/comments-service && npx prisma migrate dev --name init && npm run prisma:seed && cd ../..
```

**4. Start all subgraph services**

```bash
turbo dev --filter=users-service --filter=posts-service --filter=comments-service
```

**5. Start the supergraph router**

```bash
rover dev --supergraph-config supergraph.yaml --supergraph-port 4000
```

## Common Commands

```bash
# Build all apps and packages
turbo build

# Lint everything
turbo lint

# Type-check everything
turbo check-types

# Build a specific app
turbo build --filter=users-service

# Reset local databases and volumes
docker compose down -v && docker compose up --build

# Regenerate GraphQL types
turbo run prisma:generate
```

## Database

A single Postgres 16 container runs locally with three databases created automatically via `docker/init-db.sql`:

| Database | Service |
|---|---|
| `users_db` | users-service |
| `posts_db` | posts-service |
| `comments_db` | comments-service |

All services connect on `localhost:5432` with credentials `postgres / postgres`.

## Infrastructure (AWS)

Terraform configuration lives in `infra/`. Currently deployed to `ap-south-1` (Mumbai):

- RDS PostgreSQL 15 (`db.t3.micro`, Multi-AZ, encrypted)
- Three databases created via init Lambda
- Secrets Manager secrets for each service's `DATABASE_URL`

```bash
cd infra
terraform init
terraform plan
terraform apply
```

See `GRAPHQL_SETUP.md` for full GraphQL federation details, example queries, and N+1 / DataLoader explanation.

## Remote Caching

Enable Turborepo Remote Cache with your Vercel account:

```bash
turbo login
turbo link
```
