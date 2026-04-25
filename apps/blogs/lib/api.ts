import type { Comment, Post, PostsPage } from "./types";

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const { data, errors } = await res.json();

  if (errors?.length) {
    throw new Error(errors[0].message);
  }

  return data as T;
}

export async function getPosts(
  page: number,
  perPage: number,
): Promise<PostsPage> {
  const data = await gqlFetch<{
    posts: { total: number; page: number; perPage: number; posts: Post[] };
  }>(
    `query GetPosts($page: Int!, $perPage: Int!) {
      posts(page: $page, perPage: $perPage) {
        total
        page
        perPage
        posts {
          id
          userId
          title
          body
          publishedAt
          author {
            id
            name
            username
          }
        }
      }
    }`,
    { page, perPage },
  );

  return {
    posts: data.posts.posts,
    total: data.posts.total,
    page: data.posts.page,
    perPage: data.posts.perPage,
  };
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const data = await gqlFetch<{ post: Post | null }>(
    `query GetPost($id: ID!) {
      post(id: $id) {
        id
        userId
        title
        body
        publishedAt
        author {
          id
          name
          username
        }
      }
    }`,
    { id: String(id) },
  );

  return data.post ?? undefined;
}

export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  const data = await gqlFetch<{ comments: Comment[] }>(
    `query GetComments($postId: ID!) {
      comments(postId: $postId) {
        id
        userId
        body
        user {
          id
          name
          username
          email
        }
      }
    }`,
    { postId: String(postId) },
  );

  return data.comments;
}
