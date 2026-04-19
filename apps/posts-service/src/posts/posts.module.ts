import { Module } from "@nestjs/common";
import { PostsDataLoader } from "./posts.dataloader";
import { PostsResolver } from "./posts.resolver";
import { PostsService } from "./posts.service";
import { PrismaService } from "../prisma.service";

@Module({
  providers: [PrismaService, PostsResolver, PostsService, PostsDataLoader],
})
export class PostsModule {}
