import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COMMENTS = [
  { id: 1,  postId: 1, name: 'id labore ex et quam laborum', email: 'Eliseo@gardner.biz', body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos tempora quo necessitatibus dolor quam autem quasi reiciendis et nam sapiente accusantium' },
  { id: 2,  postId: 1, name: 'quo vero reiciendis velit similique earum', email: 'Jayne_Kuhic@sydney.com', body: 'est natus enim nihil est dolore omnis voluptatem numquam et omnis occaecati quod ullam at voluptatem error expedita pariatur nihil sint nostrum voluptatem reiciendis et' },
  { id: 3,  postId: 1, name: 'odio adipisci rerum aut animi', email: 'Nikita@garfield.biz', body: 'quia molestiae reprehenderit quasi aspernatur aut expedita occaecati aliquam eveniet laudantium omnis quibusdam delectus saepe quia accusamus maiores nam est cum et ducimus et vero voluptates excepturi deleniti ratione' },
  { id: 4,  postId: 2, name: 'alias odio sit', email: 'Lew@alysha.tv', body: 'non et atque occaecati deserunt quas accusantium unde odit nobis qui voluptatem quia voluptas consequuntur itaque dolor et qui rerum deleniti ut occaecati' },
  { id: 5,  postId: 2, name: 'vero eaque aliquid doloribus et culpa', email: 'Hayden@althea.biz', body: 'harum non quasi et ratione tempore iure ex voluptates in ratione harum architecto fugit inventore cupiditate voluptates magni quo et' },
  { id: 6,  postId: 3, name: 'et fugit eligendi deleniti quidem qui sint nihil autem', email: 'Presley.Mueller@myrl.com', body: 'doloribus at sed quis culpa deserunt consectetur qui praesentium accusamus fugiat dicta voluptatem rerum ut voluptate autem id dolore corrupti fuga sed odio ipsam' },
  { id: 7,  postId: 3, name: 'repellat consequatur praesentium vel minus molestias voluptatum', email: 'Dallas@ole.me', body: 'maiores sed dolores similique labore et inventore et quasi temporibus esse sunt id et eos voluptatem aliquam aliquid ratione corporis molestiae mollitia quia et magnam dolor' },
  { id: 8,  postId: 4, name: 'in non nisi est dolores suscipit mollitia', email: 'Mallory_Kunze@marie.org', body: 'ut voluptatem corrupti velit ad voluptatem maiores et nisi velit vero accusamus maiores voluptates quia aliquid ullam eaque' },
  { id: 9,  postId: 4, name: 'consequatur omnis aut qui saepe', email: 'Veronica_Goodwin@timmothy.net', body: 'cum natus atque eum dolores quidem voluptate iusto nam aut voluptatem animi tenetur quod ea ad voluptatem delectus aperiam quasi eum dolore maxime qui totam in' },
  { id: 10, postId: 5, name: 'temporibus sit alias delectus eligendi possimus magni', email: 'Rahel.Hamill@jung.net', body: 'debitis et qui voluptatem harum ea aut quae iure quo sunt rerum illo et saepe rerum aut et quidem adipisci' },
];

async function main() {
  for (const c of COMMENTS) {
    await prisma.comment.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    });
  }
  console.log('Comments seeded.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
