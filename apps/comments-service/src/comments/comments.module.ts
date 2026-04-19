import { Module } from "@nestjs/common";
import { CommentsDataLoader } from "./comments.dataloader";
import { CommentsResolver } from "./comments.resolver";
import { CommentsService } from "./comments.service";
import { PrismaService } from "../prisma.service";
@Module({
  providers: [
    PrismaService,
    CommentsResolver,
    CommentsService,
    CommentsDataLoader,
  ],
})
export class CommentsModule {}
