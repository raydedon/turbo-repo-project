import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  async findAll(page: number, perPage: number) {
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        // Cursor-based ordering for stable, index-friendly pagination
        orderBy: { publishedAt: "asc" },
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          userId: true,
          title: true,
          body: true,
          publishedAt: true,
        },
      }),
      this.prisma.post.count(),
    ]);

    return {
      posts: posts.map(this.mapPost),
      total,
      page,
      perPage,
    };
  }

  async findById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        title: true,
        body: true,
        publishedAt: true,
      },
    });
    return post ? this.mapPost(post) : null;
  }

  async findByIds(ids: number[]) {
    const posts = await this.prisma.post.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        userId: true,
        title: true,
        body: true,
        publishedAt: true,
      },
    });
    return posts.map(this.mapPost);
  }

  async findByUserId(userId: number) {
    const posts = await this.prisma.post.findMany({
      where: { userId },
      orderBy: { publishedAt: "asc" },
      select: {
        id: true,
        userId: true,
        title: true,
        body: true,
        publishedAt: true,
      },
    });
    return posts.map(this.mapPost);
  }

  async create(userId: number, title: string, body: string) {
    const post = await this.prisma.post.create({
      data: { userId, title, body, publishedAt: new Date() },
      select: {
        id: true,
        userId: true,
        title: true,
        body: true,
        publishedAt: true,
      },
    });
    return this.mapPost(post);
  }

  private mapPost(p: any) {
    return {
      id: p.id,
      userId: p.userId,
      title: p.title,
      body: p.body,
      publishedAt: p.publishedAt.toISOString(),
    };
  }
}
