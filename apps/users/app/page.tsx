"use client";

import { useState } from "react";
import Link from "next/link";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";
import type { User } from "../lib/types";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      username
      email
      phone
      website
      address {
        city
      }
      company {
        name
      }
    }
  }
`;

interface QueryData {
  users: User[];
}

const PER_PAGE = 10;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<QueryData>(GET_USERS);

  if (loading) {
    return <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Loading users…</p>;
  }

  if (error) {
    return <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Failed to load users.</p>;
  }

  const allUsers = data?.users ?? [];
  const totalPages = Math.ceil(allUsers.length / PER_PAGE);
  const users = allUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Users
      </h1>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>City</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Website</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                className="user-row"
              >
                <td style={tdStyle}>
                  <Link href={`/${user.id}`} style={{ fontWeight: 600, color: "var(--accent)" }}>
                    {user.name}
                  </Link>
                </td>
                <td style={{ ...tdStyle, color: "var(--muted)" }}>@{user.username}</td>
                <td style={tdStyle}>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{user.phone}</td>
                <td style={tdStyle}>{user.address.city}</td>
                <td style={tdStyle}>{user.company.name}</td>
                <td style={tdStyle}>
                  <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
        <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
          {allUsers.length} users — click a name to view details
        </p>

        {totalPages > 1 && (
          <nav style={{ display: "flex", gap: "0.5rem" }}>
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
      </div>
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

const thStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontWeight: 600,
  color: "var(--muted)",
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: React.CSSProperties = {
  padding: "0.875rem 1rem",
  verticalAlign: "middle",
};
