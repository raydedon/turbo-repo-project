import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommentsByPostId, getPostById } from "../../lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const [post, comments] = await Promise.all([
    getPostById(Number(id)),
    getCommentsByPostId(Number(id)),
  ]);

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
        <h1 style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          lineHeight: 1.3,
          margin: "0.5rem 0 1.5rem",
          textTransform: "capitalize",
        }}>
          {post.title}
        </h1>
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "1.5rem",
          lineHeight: 1.8,
          color: "var(--foreground)",
          whiteSpace: "pre-line",
        }}>
          {post.body}
        </div>
      </article>

      {/* Comments */}
      <section>
        <h2 style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "2px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          Comments
          <span style={{
            background: "var(--tag-bg)",
            color: "var(--tag-color)",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 600,
            padding: "0.1rem 0.6rem",
          }}>
            {comments.length}
          </span>
        </h2>

        {comments.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No comments yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.625rem",
                  padding: "1rem 1.25rem",
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                  gap: "0.25rem",
                }}>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{comment.name}</span>
                  <a
                    href={`mailto:${comment.email}`}
                    style={{ fontSize: "0.75rem", color: "var(--muted)" }}
                  >
                    {comment.email}
                  </a>
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--muted)" }}>
                  {comment.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
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
