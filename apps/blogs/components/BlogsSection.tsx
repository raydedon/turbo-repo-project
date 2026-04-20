"use client";

import { useState } from "react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";
import { apolloClient } from "../lib/apollo-client";
import type { Post } from "../lib/types";
import BlogCard from "./BlogCard";

const PER_PAGE = 6;

const GET_POSTS = gql`
  query GetPosts($page: Int!, $perPage: Int!) {
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
      }
    }
  }
`;

interface PostsPage {
  posts: {
    total: number;
    page: number;
    perPage: number;
    posts: Post[];
  };
}

export default function BlogsSection() {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<PostsPage>(GET_POSTS, {
    client: apolloClient,
    variables: { page, perPage: PER_PAGE },
  });

  const totalPages = data ? Math.ceil(data.posts.total / PER_PAGE) : 0;
  const posts = data?.posts.posts ?? [];
  const total = data?.posts.total ?? 0;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Blog Posts</h1>
        {!loading && (
          <p style={{ color: "var(--muted)", marginTop: "0.25rem" }}>
            {total} posts · sorted chronologically
          </p>
        )}
      </div>

      {loading && (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Loading posts…</p>
      )}

      {error && (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Failed to load posts.</p>
      )}

      {!loading && !error && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            {posts.map((post: Post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              {page > 1 && (
                <PageButton onClick={() => setPage((p) => p - 1)}>← Prev</PageButton>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PageButton key={p} onClick={() => setPage(p)} active={p === page}>
                  {p}
                </PageButton>
              ))}
              {page < totalPages && (
                <PageButton onClick={() => setPage((p) => p + 1)}>Next →</PageButton>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}

function PageButton({
  onClick,
  children,
  active,
}: {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.4rem 0.75rem",
        borderRadius: "0.375rem",
        fontSize: "0.875rem",
        border: "1px solid var(--border)",
        background: active ? "var(--accent)" : "transparent",
        color: active ? "#fff" : "var(--foreground)",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
