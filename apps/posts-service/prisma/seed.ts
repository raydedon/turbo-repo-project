import * as dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL!.split('?')[0];
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const POSTS = [
  { id: 1,  userId: 1, title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto', publishedAt: new Date('2024-01-03T09:00:00Z') },
  { id: 2,  userId: 1, title: 'qui est esse', body: 'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla', publishedAt: new Date('2024-01-10T11:30:00Z') },
  { id: 3,  userId: 1, title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut', body: 'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut', publishedAt: new Date('2024-01-18T08:15:00Z') },
  { id: 4,  userId: 1, title: 'eum et est occaecati', body: 'ullam et saepe reiciendis voluptatem adipisci sit amet autem assumenda provident rerum culpa quis hic commodi nesciunt rem tenetur doloremque ipsam iure quis sunt voluptatem rerum illo velit', publishedAt: new Date('2024-01-25T14:00:00Z') },
  { id: 5,  userId: 1, title: 'nesciunt quas odio', body: 'repudiandae veniam quaerat sunt sed alias aut fugiat sit autem sed est voluptatem omnis possimus esse voluptatibus quis est aut tenetur dolor neque', publishedAt: new Date('2024-02-02T10:45:00Z') },
  { id: 6,  userId: 2, title: 'dolorem eum magni eos aperiam quia', body: 'ut aspernatur corporis harum nihil quis provident sequi mollitia nobis aliquid molestiae perspiciatis et ea nemo ab reprehenderit accusantium quas voluptate dolores velit et doloremque molestiae', publishedAt: new Date('2024-02-09T16:20:00Z') },
  { id: 7,  userId: 2, title: 'magnam facilis autem', body: 'dolore placeat quibusdam ea quo vitae magni quis enim qui quis quo nemo aut saepe quidem repellat excepturi ut quia sunt ut sequi eos ea sed quas', publishedAt: new Date('2024-02-17T09:10:00Z') },
  { id: 8,  userId: 2, title: 'dolorem dolore est ipsam', body: 'dignissimos aperiam dolorem qui eum facilis quibusdam animi sint suscipit qui sint possimus cum quaerat magni maiores excepturi ipsam ut commodi dolor voluptatum modi aut vitae', publishedAt: new Date('2024-02-24T13:30:00Z') },
  { id: 9,  userId: 2, title: 'nesciunt iure omnis dolorem tempora et accusantium', body: 'consectetur animi nesciunt iure dolore enim quia ad veniam autem ut quam aut nobis et est aut quod aut provident voluptas autem voluptas', publishedAt: new Date('2024-03-03T07:55:00Z') },
  { id: 10, userId: 2, title: 'optio molestias id quia eum', body: 'quo et expedita modi cum officia vel magni doloribus qui repudiandae vero nisi sit quos veniam quod sed accusamus veritatis error', publishedAt: new Date('2024-03-10T15:00:00Z') },
  { id: 11, userId: 3, title: 'et ea vero quia laudantium autem', body: 'delectus reiciendis molestiae occaecati non minima eveniet qui suicipit ipsum rerum obcaecati impedit odit illo dolorum ab temporibus dolorem error ea', publishedAt: new Date('2024-03-18T11:00:00Z') },
  { id: 12, userId: 3, title: 'in quibusdam tempore odit est dolorem', body: 'itaque id aut magnam praesentium quia et ea odit et ea voluptas et sapiente quia nihil amet occaecati quia id voluptatem incidunt ea est distinctio odio', publishedAt: new Date('2024-03-25T09:45:00Z') },
  { id: 13, userId: 3, title: 'dolorum ut in voluptas mollitia et saepe quo animi', body: 'aut dicta possimus sint mollitia voluptas commodi quo doloremque iste corrupti reiciendis voluptatem eius rerum sit cumque quod eligendi laborum minima perferendis recusandae assumenda consectetur porro architecto ipsum ipsam', publishedAt: new Date('2024-04-01T14:20:00Z') },
  { id: 14, userId: 3, title: 'voluptatem eligendi optio', body: 'fuga et accusamus dolorum perferendis illo voluptas non doloremque neque facere ad qui dolorum molestiae beatae sed aut voluptas totam sit illum', publishedAt: new Date('2024-04-08T10:30:00Z') },
  { id: 15, userId: 3, title: 'eveniet quod temporibus', body: 'reprehenderit quos placeat velit minima officia dolores impedit repudiandae molestiae nam voluptas recusandae quis delectus officiis harum fugiat vitae', publishedAt: new Date('2024-04-15T08:00:00Z') },
  { id: 16, userId: 4, title: 'sint suscipit perspiciatis velit dolorum rerum ipsa laboriosam odio', body: 'suscipit nam nisi quo aperiam aut asperiores eos fugit maiores laudantium enim accusamus voluptas distinctio natus dolor et sed molestiae differentibus tenetur voluptatem ea', publishedAt: new Date('2024-04-22T16:00:00Z') },
  { id: 17, userId: 4, title: 'fugit voluptas sed molestias voluptatem provident', body: 'eos voluptas et aut odit natus earum aspernatur fuga molestiae ullam deseriunt ratione qui eos qui nihil ratione nemo velit ut aut id quo', publishedAt: new Date('2024-04-29T11:15:00Z') },
  { id: 18, userId: 4, title: 'voluptate et itaque vero tempora molestiae', body: 'eveniet quo quis laborum totam consequatur non dolor ut et est repudiandae est voluptatem vel debitis et magnam', publishedAt: new Date('2024-05-06T09:00:00Z') },
  { id: 19, userId: 4, title: 'adipisci placeat illum aut reiciendis qui', body: 'illum quis cupiditate provident sit magnam ea sed aut causa vel voluptatem et est rerum autem nostrum occaecati possimus quis ipsam sed dolore in', publishedAt: new Date('2024-05-13T13:45:00Z') },
  { id: 20, userId: 4, title: 'doloribus ad provident suscipit at', body: 'qui consequuntur ducimus possimus quisquam amet similique suscipit porro ipsam amet eos veritatis officiis exercitationem vel fugit aut necessitatibus voluptatum animi quia asperiores dolores dignissimos', publishedAt: new Date('2024-05-20T10:00:00Z') },
];

async function main() {
  for (const p of POSTS) {
    await prisma.post.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }
  console.log(`Seeded ${POSTS.length} posts.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
