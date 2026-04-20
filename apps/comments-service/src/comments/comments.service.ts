import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

const SELECT = { id: true, postId: true, userId: true, body: true } as const;

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPostId(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      select: SELECT,
    });
  }

  async findById(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
      select: SELECT,
    });
  }

  async findByIds(ids: number[]) {
    return this.prisma.comment.findMany({
      where: { id: { in: ids } },
      select: SELECT,
    });
  }

  async create(postId: number, body: string, userId: number) {
    return this.prisma.comment.create({
      data: { postId, body, userId },
      select: SELECT,
    });
  }
}
