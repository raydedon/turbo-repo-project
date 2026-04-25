import * as dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL!.split('?')[0];
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const COMMENTS = [
  { id: 1,  postId: 1, userId: 2,  body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos tempora quo necessitatibus dolor quam autem quasi reiciendis et nam sapiente accusantium' },
  { id: 2,  postId: 1, userId: 3,  body: 'est natus enim nihil est dolore omnis voluptatem numquam et omnis occaecati quod ullam at voluptatem error expedita pariatur nihil sint nostrum voluptatem reiciendis et' },
  { id: 3,  postId: 1, userId: 4,  body: 'quia molestiae reprehenderit quasi aspernatur aut expedita occaecati aliquam eveniet laudantium omnis quibusdam delectus saepe quia accusamus maiores nam est cum et ducimus et vero voluptates excepturi deleniti ratione' },
  { id: 4,  postId: 2, userId: 5,  body: 'non et atque occaecati deserunt quas accusantium unde odit nobis qui voluptatem quia voluptas consequuntur itaque dolor et qui rerum deleniti ut occaecati' },
  { id: 5,  postId: 2, userId: 6,  body: 'harum non quasi et ratione tempore iure ex voluptates in ratione harum architecto fugit inventore cupiditate voluptates magni quo et' },
  { id: 6,  postId: 3, userId: 7,  body: 'doloribus at sed quis culpa deserunt consectetur qui praesentium accusamus fugiat dicta voluptatem rerum ut voluptate autem id dolore corrupti fuga sed odio ipsam' },
  { id: 7,  postId: 3, userId: 8,  body: 'maiores sed dolores similique labore et inventore et quasi temporibus esse sunt id et eos voluptatem aliquam aliquid ratione corporis molestiae mollitia quia et magnam dolor' },
  { id: 8,  postId: 4, userId: 9,  body: 'ut voluptatem corrupti velit ad voluptatem maiores et nisi velit vero accusamus maiores voluptates quia aliquid ullam eaque' },
  { id: 9,  postId: 4, userId: 10, body: 'cum natus atque eum dolores quidem voluptate iusto nam aut voluptatem animi tenetur quod ea ad voluptatem delectus aperiam quasi eum dolore maxime qui totam in' },
  { id: 10, postId: 5, userId: 1,  body: 'debitis et qui voluptatem harum ea aut quae iure quo sunt rerum illo et saepe rerum aut et quidem adipisci' },
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
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
