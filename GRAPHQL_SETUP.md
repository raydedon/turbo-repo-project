# GraphQL Federation Setup

## Architecture

```
Browser / Next.js apps
        │
        ▼
Apollo Router :4000  (supergraph gateway — run via `rover dev`)
        │
        ├── users-service    :4001  (NestJS subgraph)  ──┐
        ├── posts-service    :4002  (NestJS subgraph)  ──┼── postgres :5432 (users_db / posts_db / comments_db)
        └── comments-service :4003  (NestJS subgraph)  ──┘
```

## Local Dev (Recommended — `rover dev`)

`rover dev` starts Apollo Router AND composes the supergraph live from running subgraphs. No manual schema file needed.

### Step 1 — Install tools

```bash
# Apollo Rover CLI
curl -sSL https://rover.apollo.dev/nix/latest | sh

# Apollo Router binary (rover dev downloads it automatically)
```

### Step 2 — Start database only

```bash
docker compose up postgres
```

### Step 3 — Copy env files and run migrations

```bash
# users-service
cp apps/users-service/.env.example apps/users-service/.env
cd apps/users-service && npm install && npx prisma migrate dev --name init && npm run prisma:seed && cd ../..

# posts-service
cp apps/posts-service/.env.example apps/posts-service/.env
cd apps/posts-service && npm install && npx prisma migrate dev --name init && npm run prisma:seed && cd ../..

# comments-service
cp apps/comments-service/.env.example apps/comments-service/.env
cd apps/comments-service && npm install && npx prisma migrate dev --name init && npm run prisma:seed && cd ../..
```

### Step 4 — Start subgraph services

```bash
# In separate terminals (or use turbo)
cd apps/users-service   && npm run dev
cd apps/posts-service   && npm run dev
cd apps/comments-service && npm run dev
```

### Step 5 — Start the supergraph router

```bash
rover dev --supergraph-config supergraph.yaml --supergraph-port 4000
```

Apollo Sandbox is now available at **http://localhost:4000**.

---

## Full Docker Stack

To run everything in Docker (all DBs + services):

```bash
docker compose up --build
```

Then run `rover dev` locally to spin up the Router pointing at the containerised services.

> The Apollo Router service in `docker-compose.yml` is commented out because it requires a pre-composed supergraph schema file. Use `rover dev` for local development.

---

## Example Queries

### Federated query (resolves across all 3 services)

```graphql
query {
  posts(page: 1, perPage: 6) {
    total
    posts {
      id
      title
      publishedAt
      author {
        # resolved from users-service
        name
        email
        company {
          name
        }
      }
    }
  }
}
```

### Post with comments

```graphql
query GetPost($id: ID!) {
  post(id: $id) {
    title
    body
    author {
      name
    }
  }
  comments(postId: $id) {
    id
    userId
    body
  }
}
```

### Create post (triggers subscription)

```graphql
mutation {
  createPost(userId: "1", title: "Hello World", body: "My first post") {
    id
    title
    publishedAt
  }
}
```

### Subscribe to new comments

```graphql
subscription {
  commentAdded(postId: "1") {
    id
    name
    body
  }
}
```

---

## N+1 Explained

When the Router receives:

```graphql
{
  posts {
    author {
      name
    }
  }
}
```

**Without DataLoader:** posts returns 10 rows → 10 separate `__resolveReference` calls to users-service → 10 DB queries.

**With DataLoader:** The Router batches all 10 user IDs into one `_entities` query → `UsersDataLoader` fires one `prisma.user.findMany({ where: { id: { in: [1,2,3...] } } })` → 1 DB query total.

---

## Connecting the Next.js Apps

Once the router is running, replace the placeholder functions in:

- `apps/blogs/lib/api.ts` — use Apollo Client against `http://localhost:4000/graphql`
- `apps/users/lib/api.ts` — same endpoint

Install Apollo Client in both frontend apps:

```bash
npm install @apollo/client graphql --workspace=blogs --workspace=users
```
