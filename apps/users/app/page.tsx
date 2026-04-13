import Link from "next/link";
import { getUsers } from "../lib/api";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1
        style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}
      >
        Users
      </h1>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9rem",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "2px solid var(--border)",
                textAlign: "left",
              }}
            >
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
                style={{
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                }}
                className="user-row"
              >
                <td style={tdStyle}>
                  <Link
                    href={`/${user.id}`}
                    style={{ fontWeight: 600, color: "var(--accent)" }}
                  >
                    {user.name}
                  </Link>
                </td>
                <td style={{ ...tdStyle, color: "var(--muted)" }}>
                  @{user.username}
                </td>
                <td style={tdStyle}>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {user.phone}
                </td>
                <td style={tdStyle}>{user.address.city}</td>
                <td style={tdStyle}>{user.company.name}</td>
                <td style={tdStyle}>
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p
        style={{ marginTop: "1rem", color: "var(--muted)", fontSize: "0.8rem" }}
      >
        {users.length} users — click a name to view details
      </p>
    </div>
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
