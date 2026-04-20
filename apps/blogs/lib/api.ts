import type { Comment, Post, PostsPage } from "./types";

// ---------------------------------------------------------------------------
// GraphQL placeholder
//
// TODO: Replace these functions with GraphQL queries once the API is ready.
//
// Example shape for getPosts (paginated):
//   query GetPosts($page: Int!, $perPage: Int!) {
//     posts(page: $page, perPage: $perPage, orderBy: { publishedAt: DESC }) {
//       total
//       nodes {
//         id
//         userId
//         title
//         body
//         publishedAt
//       }
//     }
//   }
//
// Example shape for getPostById:
//   query GetPost($id: ID!) {
//     post(id: $id) {
//       id
//       userId
//       title
//       body
//       publishedAt
//     }
//   }
//
// Example shape for getCommentsByPostId:
//   query GetComments($postId: ID!) {
//     comments(postId: $postId) {
//       id
//       name
//       email
//       body
//     }
//   }
// ---------------------------------------------------------------------------

const MOCK_POSTS: Post[] = [
  { id: 1,  userId: 1, title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit", body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto", publishedAt: "2024-01-03T09:00:00Z" },
  { id: 2,  userId: 1, title: "qui est esse", body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla", publishedAt: "2024-01-10T11:30:00Z" },
  { id: 3,  userId: 1, title: "ea molestias quasi exercitationem repellat qui ipsa sit aut", body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut", publishedAt: "2024-01-18T08:15:00Z" },
  { id: 4,  userId: 1, title: "eum et est occaecati", body: "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit", publishedAt: "2024-01-25T14:00:00Z" },
  { id: 5,  userId: 1, title: "nesciunt quas odio", body: "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque", publishedAt: "2024-02-02T10:45:00Z" },
  { id: 6,  userId: 2, title: "dolorem eum magni eos aperiam quia", body: "ut aspernatur corporis harum nihil quis provident sequi\nmollitia nobis aliquid molestiae\nperspiciatis et ea nemo ab reprehenderit accusantium quas\nvoluptate dolores velit et doloremque molestiae", publishedAt: "2024-02-09T16:20:00Z" },
  { id: 7,  userId: 2, title: "magnam facilis autem", body: "dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat excepturi ut quia\nsunt ut sequi eos ea sed quas", publishedAt: "2024-02-17T09:10:00Z" },
  { id: 8,  userId: 2, title: "dolorem dolore est ipsam", body: "dignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae", publishedAt: "2024-02-24T13:30:00Z" },
  { id: 9,  userId: 2, title: "nesciunt iure omnis dolorem tempora et accusantium", body: "consectetur animi nesciunt iure dolore\nenim quia ad\nveniam autem ut quam aut nobis\net est aut quod aut provident voluptas autem voluptas", publishedAt: "2024-03-03T07:55:00Z" },
  { id: 10, userId: 2, title: "optio molestias id quia eum", body: "quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error", publishedAt: "2024-03-10T15:00:00Z" },
  { id: 11, userId: 3, title: "et ea vero quia laudantium autem", body: "delectus reiciendis molestiae occaecati non minima eveniet qui suicipit ipsum\nrerum obcaecati impedit odit illo dolorum ab\ntemporibus dolorem error ea", publishedAt: "2024-03-18T11:00:00Z" },
  { id: 12, userId: 3, title: "in quibusdam tempore odit est dolorem", body: "itaque id aut magnam\npraesentium quia et ea odit et ea voluptas et\nsapiente quia nihil amet occaecati quia id voluptatem\nincidunt ea est distinctio odio", publishedAt: "2024-03-25T09:45:00Z" },
  { id: 13, userId: 3, title: "dolorum ut in voluptas mollitia et saepe quo animi", body: "aut dicta possimus sint mollitia voluptas commodi quo doloremque\niste corrupti reiciendis voluptatem eius rerum\nsit cumque quod eligendi laborum minima\nperferendis recusandae assumenda consectetur porro architecto ipsum ipsam", publishedAt: "2024-04-01T14:20:00Z" },
  { id: 14, userId: 3, title: "voluptatem eligendi optio", body: "fuga et accusamus dolorum perferendis illo voluptas\nnon doloremque neque facere\nad qui dolorum molestiae beatae\nsed aut voluptas totam sit illum", publishedAt: "2024-04-08T10:30:00Z" },
  { id: 15, userId: 3, title: "eveniet quod temporibus", body: "reprehenderit quos placeat\nvelit minima officia dolores impedit repudiandae molestiae nam\nvoluptas recusandae quis delectus\nofficiis harum fugiat vitae", publishedAt: "2024-04-15T08:00:00Z" },
  { id: 16, userId: 4, title: "sint suscipit perspiciatis velit dolorum rerum ipsa laboriosam odio", body: "suscipit nam nisi quo aperiam aut\nasperiores eos fugit maiores laudantium enim accusamus voluptas\ndistinctio natus dolor\net sed molestiae differentibus tenetur voluptatem ea", publishedAt: "2024-04-22T16:00:00Z" },
  { id: 17, userId: 4, title: "fugit voluptas sed molestias voluptatem provident", body: "eos voluptas et aut odit natus earum\naspernatur fuga molestiae ullam\ndeseriunt ratione qui eos\nqui nihil ratione nemo velit ut aut id quo", publishedAt: "2024-04-29T11:15:00Z" },
  { id: 18, userId: 4, title: "voluptate et itaque vero tempora molestiae", body: "eveniet quo quis\nlaborum totam consequatur non dolor\nut et est repudiandae\nest voluptatem vel debitis et magnam", publishedAt: "2024-05-06T09:00:00Z" },
  { id: 19, userId: 4, title: "adipisci placeat illum aut reiciendis qui", body: "illum quis cupiditate provident sit magnam\nea sed aut causa\nvel voluptatem et est rerum autem nostrum\noccaecati possimus quis ipsam sed dolore in", publishedAt: "2024-05-13T13:45:00Z" },
  { id: 20, userId: 4, title: "doloribus ad provident suscipit at", body: "qui consequuntur ducimus possimus quisquam amet similique\nsuscipit porro ipsam amet\neos veritatis officiis exercitationem vel fugit aut necessitatibus voluptatum\nanimi quia asperiores dolores dignissimos", publishedAt: "2024-05-20T10:00:00Z" },
];

const MOCK_COMMENTS: Comment[] = [
  { id: 1,  postId: 1, userId: 2,  body: "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium" },
  { id: 2,  postId: 1, userId: 3,  body: "est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et" },
  { id: 3,  postId: 1, userId: 4,  body: "quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione" },
  { id: 4,  postId: 1, userId: 5,  body: "non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati" },
  { id: 5,  postId: 1, userId: 6,  body: "harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et" },
  { id: 6,  postId: 2, userId: 7,  body: "doloribus at sed quis culpa deserunt consectetur qui praesentium\naccusamus fugiat dicta\nvoluptatem rerum ut voluptate autem\nid dolore corrupti fuga sed odio ipsam" },
  { id: 7,  postId: 2, userId: 8,  body: "maiores sed dolores similique labore et inventore et\nquasi temporibus esse sunt id et\neos voluptatem aliquam\naliquid ratione corporis molestiae mollitia quia et magnam dolor" },
  { id: 8,  postId: 2, userId: 9,  body: "ut voluptatem corrupti velit\nad voluptatem maiores\net nisi velit vero accusamus maiores\nvoluptates quia aliquid ullam eaque" },
  { id: 9,  postId: 2, userId: 10, body: "cum natus atque eum dolores quidem voluptate iusto\nnam aut voluptatem animi tenetur quod ea ad\nvoluptatem delectus aperiam quasi eum dolore maxime\nqui totam in" },
  { id: 10, postId: 2, userId: 1,  body: "debitis et qui\nvoluptatem harum ea\naut quae iure quo sunt rerum\nillo et saepe rerum aut et quidem adipisci" },
];

export async function getPosts(page: number, perPage: number): Promise<PostsPage> {
  // TODO: Replace with GraphQL query — see comment block above
  // Posts are sorted chronologically (oldest first)
  const sorted = [...MOCK_POSTS].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
  const start = (page - 1) * perPage;
  const slice = sorted.slice(start, start + perPage);
  return {
    posts: slice,
    total: sorted.length,
    page,
    perPage,
  };
}

export async function getPostById(id: number): Promise<Post | undefined> {
  // TODO: Replace with GraphQL query — see comment block above
  return MOCK_POSTS.find((p) => p.id === id);
}

export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  // TODO: Replace with GraphQL query — see comment block above
  return MOCK_COMMENTS.filter((c) => c.postId === postId);
}
