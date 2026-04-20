import type { Comment as CommentType } from "../lib/types";

interface Props {
  comment: CommentType;
}

export default function Comment({ comment }: Props) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "0.625rem",
        padding: "1rem 1.25rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
          flexWrap: "wrap",
          gap: "0.25rem",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
          {comment.user?.username}
        </span>
        <a
          href={`/users/${comment.userId}`}
          style={{ fontSize: "0.75rem", color: "var(--muted)" }}
        >
          {comment.user?.email}
        </a>
      </div>
      <p
        style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--muted)" }}
      >
        {comment.body}
      </p>
    </div>
  );
}
