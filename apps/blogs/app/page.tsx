import Link from "next/link";
import { getPosts } from "../lib/api";

const PER_PAGE = 6;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogListPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const { posts, total, perPage } = await getPosts(page, PER_PAGE);
  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Blog Posts</h1>
        <p style={{ color: "var(--muted)", marginTop: "0.25rem" }}>
          {total} posts · sorted chronologically
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1.25rem",
        marginBottom: "2.5rem",
      }}>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <article style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              transition: "border-color 0.15s",
            }}>
              <time style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                {formatDate(post.publishedAt)}
              </time>
              <h2 style={{
                fontSize: "1rem",
                fontWeight: 600,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {post.title}
              </h2>
              <p style={{
                fontSize: "0.875rem",
                color: "var(--muted)",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}>
                {post.body}
              </p>
              <span style={{ fontSize: "0.8rem", color: "var(--accent)", marginTop: "auto" }}>
                Read more →
              </span>
            </article>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
        {page > 1 && (
          <PaginationLink href={`/?page=${page - 1}`}>← Prev</PaginationLink>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationLink
            key={p}
            href={`/?page=${p}`}
            active={p === page}
          >
            {p}
          </PaginationLink>
        ))}

        {page < totalPages && (
          <PaginationLink href={`/?page=${page + 1}`}>Next →</PaginationLink>
        )}
      </nav>
    </div>
  );
}

function PaginationLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: "0.4rem 0.75rem",
        borderRadius: "0.375rem",
        fontSize: "0.875rem",
        border: "1px solid var(--border)",
        background: active ? "var(--accent)" : "transparent",
        color: active ? "#fff" : "var(--foreground)",
        textDecoration: "none",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </Link>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
