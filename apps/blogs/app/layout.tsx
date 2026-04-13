import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Blogs",
  description: "Blogs microfrontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "1rem 2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <a
            href="/"
            style={{
              fontWeight: 700,
              fontSize: "1.125rem",
              color: "var(--foreground)",
            }}
          >
            Blogs
          </a>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginLeft: "auto",
            }}
          >
            <a href="/users" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              Users
            </a>
          </nav>
        </header>
        <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
