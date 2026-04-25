import type { User } from "./types";

// ---------------------------------------------------------------------------
// GraphQL placeholder
//
// TODO: Replace these functions with GraphQL queries once the API is ready.
//
// Example shape for getUsers:
//   query GetUsers {
//     users {
//       id
//       name
//       username
//       email
//       phone
//       website
//       address { street suite city zipcode }
//       company { name }
//     }
//   }
//
// Example shape for getUserById:
//   query GetUser($id: ID!) {
//     user(id: $id) {
//       id
//       name
//       username
//       email
//       phone
//       website
//       address { street suite city zipcode geo { lat lng } }
//       company { name catchPhrase bs }
//     }
//   }
// ---------------------------------------------------------------------------

const MOCK_USERS: User[] = [];

export async function getUsers(): Promise<User[]> {
  // TODO: Replace with GraphQL query — see comment block above
  return MOCK_USERS;
}

export async function getUserById(id: number): Promise<User | undefined> {
  // TODO: Replace with GraphQL query — see comment block above
  return MOCK_USERS.find((u) => u.id === id);
}
