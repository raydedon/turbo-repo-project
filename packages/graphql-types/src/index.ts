/**
 * Shared GraphQL TypeScript types — generated from the supergraph schema.
 *
 * To regenerate:
 *   1. Start all services: docker compose up users-service posts-service comments-service
 *   2. Compose supergraph: rover supergraph compose --config supergraph.yaml > dist/schema/supergraph.graphql
 *   3. Run codegen: npm run codegen (from packages/graphql-types)
 *
 * The file below is auto-generated — do not edit manually.
 */

// Hand-authored types matching the supergraph schema until codegen runs
export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  publishedAt: string;
  author?: User;
}

export interface PostsPage {
  posts: Post[];
  total: number;
  page: number;
  perPage: number;
}

export interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  body: string;
  post?: Post;
}
