"use client";

import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";
import type { Comment } from "../lib/types";
import CommentCard from "./Comment";

const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
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
  }
`;

interface QueryData {
  comments: Comment[];
}

interface Props {
  postId: number;
}

export default function CommentsSection({ postId }: Props) {
  const { data, loading, error } = useQuery<QueryData>(GET_COMMENTS, {
    variables: { postId: String(postId) },
  });

  if (loading) {
    return (
      <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
        Loading comments…
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
        Failed to load comments.
      </p>
    );
  }

  const comments = data?.comments ?? [];

  return (
    <section>
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          marginBottom: "1.25rem",
          paddingBottom: "0.75rem",
          borderBottom: "2px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        Comments
        <span
          style={{
            background: "var(--tag-bg)",
            color: "var(--tag-color)",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 600,
            padding: "0.1rem 0.6rem",
          }}
        >
          {comments.length}
        </span>
      </h2>

      {comments.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          No comments yet.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {comments.map((comment: Comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}
