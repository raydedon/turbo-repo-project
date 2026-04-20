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
        <span style={{ fontSize: "0.8rem", color: "var(--accent)", marginTop: "auto" }}>
          Read more →
        </span>
      </article>
    </Link>
  );
}
