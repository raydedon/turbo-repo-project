'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client/core';
import Link from 'next/link';
import type { Post } from '../../../lib/types';

const GET_POSTS_BY_USER = gql`
  query GetPostsByUser($userId: ID!) {
    postsByUser(userId: $userId) {
      id
      title
      body
      publishedAt
    }
  }
`;

interface Data {
  postsByUser: Post[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function UserPostsSection({ userId }: { userId: number }) {
  const { data, loading, error } = useQuery<Data>(GET_POSTS_BY_USER, {
    variables: { userId },
  });

  return (
    <section style={{ marginTop: '2.5rem' }}>
      <h2
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--muted)',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        Posts
      </h2>

      {loading && (
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Loading posts…</p>
      )}

      {error && (
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          Could not load posts.
        </p>
      )}

      {data && data.postsByUser.length === 0 && (
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>No posts yet.</p>
      )}

      {data && data.postsByUser.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {data.postsByUser.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border, var(--border))',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <time style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {formatDate(post.publishedAt)}
                </time>
                <h3
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    textTransform: 'capitalize',
                    margin: 0,
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--muted)',
                    lineHeight: 1.6,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    margin: 0,
                  }}
                >
                  {post.body}
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
