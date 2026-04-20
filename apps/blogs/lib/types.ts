export interface PostAuthor {
  id: number;
  name: string;
  username: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  publishedAt: string; // ISO 8601
  author?: PostAuthor;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  body: string;
  user?: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}

export interface PostsPage {
  posts: Post[];
  total: number;
  page: number;
  perPage: number;
}
