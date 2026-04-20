import Link from "next/link";
import type { Post } from "../lib/types";

interface Props {
  post: Post;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ post }: Props) {
  return (
    <Link href={`/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "0.75rem",
          padding: "1.25rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          transition: "border-color 0.15s",
          cursor: "pointer",
        }}
      >
        <time style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
          {formatDate(post.publishedAt)}
        </time>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {post.body}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "var(--accent)" }}>Read more →</span>
          {post.author && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <div
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, lineHeight: 1.2 }}>
                  {post.author.name}
                </p>
                <p style={{ fontSize: "0.65rem", color: "var(--muted)", lineHeight: 1.2 }}>
                  @{post.author.username}
                </p>
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
