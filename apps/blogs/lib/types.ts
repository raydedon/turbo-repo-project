export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  publishedAt: string; // ISO 8601
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface PostsPage {
  posts: Post[];
  total: number;
  page: number;
  perPage: number;
}
