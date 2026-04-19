import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, postId: true, name: true, email: true, body: true },
    });
  }

  async findById(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
      select: { id: true, postId: true, name: true, email: true, body: true },
    });
  }

  async findByIds(ids: number[]) {
    return this.prisma.comment.findMany({
      where: { id: { in: ids } },
      select: { id: true, postId: true, name: true, email: true, body: true },
    });
  }

  async create(postId: number, name: string, email: string, body: string) {
    return this.prisma.comment.create({
      data: { postId, name, email, body },
      select: { id: true, postId: true, name: true, email: true, body: true },
    });
  }
}
