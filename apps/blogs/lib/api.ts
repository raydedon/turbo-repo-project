import type { Comment, Post, PostsPage } from "./types";

// ---------------------------------------------------------------------------
// GraphQL placeholder
//
// TODO: Replace these functions with GraphQL queries once the API is ready.
//
// Example shape for getPosts (paginated):
//   query GetPosts($page: Int!, $perPage: Int!) {
//     posts(page: $page, perPage: $perPage, orderBy: { publishedAt: DESC }) {
//       total
//       nodes {
//         id
//         userId
//         title
//         body
//         publishedAt
//       }
//     }
//   }
//
// Example shape for getPostById:
//   query GetPost($id: ID!) {
//     post(id: $id) {
//       id
//       userId
//       title
//       body
//       publishedAt
//     }
//   }
//
// Example shape for getCommentsByPostId:
//   query GetComments($postId: ID!) {
//     comments(postId: $postId) {
//       id
//       name
//       email
//       body
//     }
//   }
// ---------------------------------------------------------------------------

const MOCK_POSTS: Post[] = [];

const MOCK_COMMENTS: Comment[] = [];

export async function getPosts(
  page: number,
  perPage: number,
): Promise<PostsPage> {
  // TODO: Replace with GraphQL query — see comment block above
  // Posts are sorted chronologically (oldest first)
  const sorted = [...MOCK_POSTS].sort(
    (a, b) =>
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
  );
  const start = (page - 1) * perPage;
  const slice = sorted.slice(start, start + perPage);
  return {
    posts: slice,
    total: sorted.length,
    page,
    perPage,
  };
}

export async function getPostById(id: number): Promise<Post | undefined> {
  // TODO: Replace with GraphQL query — see comment block above
  return MOCK_POSTS.find((p) => p.id === id);
}

export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  // TODO: Replace with GraphQL query — see comment block above
  return MOCK_COMMENTS.filter((c) => c.postId === postId);
}
