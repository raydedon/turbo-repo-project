import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const POSTS = [
  { id: 1,  userId: 1, title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto', publishedAt: new Date('2024-01-03T09:00:00Z') },
  { id: 2,  userId: 1, title: 'qui est esse', body: 'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla', publishedAt: new Date('2024-01-10T11:30:00Z') },
  { id: 3,  userId: 1, title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut', body: 'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut', publishedAt: new Date('2024-01-18T08:15:00Z') },
  { id: 4,  userId: 2, title: 'eum et est occaecati', body: 'ullam et saepe reiciendis voluptatem adipisci sit amet autem assumenda provident rerum culpa quis hic commodi nesciunt rem tenetur doloremque ipsam iure quis sunt voluptatem rerum illo velit', publishedAt: new Date('2024-01-25T14:00:00Z') },
  { id: 5,  userId: 2, title: 'nesciunt quas odio', body: 'repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque', publishedAt: new Date('2024-02-02T10:45:00Z') },
  { id: 6,  userId: 2, title: 'dolorem eum magni eos aperiam quia', body: 'ut aspernatur corporis harum nihil quis provident sequi mollitia nobis aliquid molestiae perspiciatis et ea nemo ab reprehenderit accusantium quas voluptate dolores velit et doloremque molestiae', publishedAt: new Date('2024-02-09T16:20:00Z') },
  { id: 7,  userId: 3, title: 'magnam facilis autem', body: 'dolore placeat quibusdam ea quo vitae magni quis enim qui quis quo nemo aut saepe quidem repellat excepturi ut quia sunt ut sequi eos ea sed quas', publishedAt: new Date('2024-02-17T09:10:00Z') },
  { id: 8,  userId: 3, title: 'dolorem dolore est ipsam', body: 'dignissimos aperiam dolorem qui eum facilis quibusdam animi sint suscipit qui sint possimus cum quaerat magni maiores excepturi ipsam ut commodi dolor voluptatum modi aut vitae', publishedAt: new Date('2024-02-24T13:30:00Z') },
  { id: 9,  userId: 3, title: 'nesciunt iure omnis dolorem tempora et accusantium', body: 'consectetur animi nesciunt iure dolore enim quia ad veniam autem ut quam aut nobis et est aut quod aut provident voluptas autem voluptas', publishedAt: new Date('2024-03-03T07:55:00Z') },
  { id: 10, userId: 4, title: 'optio molestias id quia eum', body: 'quo et expedita modi cum officia vel magni doloribus qui repudiandae vero nisi sit quos veniam quod sed accusamus veritatis error', publishedAt: new Date('2024-03-10T15:00:00Z') },
];

async function main() {
  for (const p of POSTS) {
    await prisma.post.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }
  console.log('Posts seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
