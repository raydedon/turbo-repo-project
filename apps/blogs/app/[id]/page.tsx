import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById, getPosts } from "../../lib/api";
import CommentsSection from "../../components/CommentsSection";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { posts } = await getPosts(1, 100);
  return posts.map((post) => ({ id: String(post.id) }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(Number(id));

  if (!post) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {/* Back link */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
          color: "var(--muted)",
          textDecoration: "none",
        }}
      >
        ← Back to Posts
      </Link>

      {/* Post */}
      <article style={{ marginBottom: "3rem" }}>
        <time style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
          {formatDate(post.publishedAt)}
        </time>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            lineHeight: 1.3,
            margin: "0.5rem 0 1.5rem",
            textTransform: "capitalize",
          }}
        >
          {post.title}
        </h1>
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            lineHeight: 1.8,
            color: "var(--foreground)",
            whiteSpace: "pre-line",
          }}
        >
          {post.body}
        </div>
      </article>

      {/* Comments */}
      <CommentsSection postId={Number(id)} />
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
