import type { User } from "./types";

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const { data, errors } = await res.json();

  if (errors?.length) {
    throw new Error(errors[0].message);
  }

  return data as T;
}

export async function getUsers(): Promise<User[]> {
  const data = await gqlFetch<{ users: User[] }>(
    `query GetUsers {
      users {
        id
        name
        username
        email
        phone
        website
        address {
          street
          suite
          city
          zipcode
          geo { lat lng }
        }
        company {
          name
          catchPhrase
          bs
        }
      }
    }`,
  );

  return data.users;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const data = await gqlFetch<{ user: User | null }>(
    `query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        username
        email
        phone
        website
        address {
          street
          suite
          city
          zipcode
          geo { lat lng }
        }
        company {
          name
          catchPhrase
          bs
        }
      }
    }`,
    { id: String(id) },
  );

  return data.user ?? undefined;
}
