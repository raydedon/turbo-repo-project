import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserById } from "../../lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getUserById(Number(id));

  if (!user) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
          color: "var(--muted)",
        }}
      >
        ← Back to Users
      </Link>

      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          marginBottom: "0.25rem",
        }}
      >
        {user.name}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        @{user.username}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Contact */}
        <Section title="Contact">
          <Field label="Email">
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </Field>
          <Field label="Phone">{user.phone}</Field>
          <Field label="Website">
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.website}
            </a>
          </Field>
        </Section>

        {/* Address */}
        <Section title="Address">
          <Field label="Street">
            {user.address.street}, {user.address.suite}
          </Field>
          <Field label="City">{user.address.city}</Field>
          <Field label="Zipcode">{user.address.zipcode}</Field>
          <Field label="Coordinates">
            {user.address.geo.lat}, {user.address.geo.lng}
          </Field>
        </Section>

        {/* Company */}
        <Section title="Company" style={{ gridColumn: "1 / -1" }}>
          <Field label="Name">{user.company.name}</Field>
          <Field label="Catch Phrase">{user.company.catchPhrase}</Field>
          <Field label="Business">{user.company.bs}</Field>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: "0.75rem",
        padding: "1.25rem 1.5rem",
        ...style,
      }}
    >
      <h2
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--muted)",
          marginBottom: "0.875rem",
        }}
      >
        {title}
      </h2>
      <dl style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {children}
      </dl>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <dt
        style={{ fontSize: "0.8rem", color: "var(--muted)", minWidth: "90px" }}
      >
        {label}:
      </dt>
      <dd style={{ fontSize: "0.875rem", fontWeight: 500 }}>{children}</dd>
    </div>
  );
}
