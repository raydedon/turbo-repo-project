import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PostsService } from './posts.service';
import { Post } from './dto/post.type';

/**
 * REQUEST-scoped DataLoader for Post entity resolution.
 * Batches all __resolveReference calls for Post within a single request
 * into one prisma.post.findMany query.
 */
@Injectable({ scope: Scope.REQUEST })
export class PostsDataLoader {
  private readonly loader: DataLoader<number, Post | null>;

  constructor(private readonly postsService: PostsService) {
    this.loader = new DataLoader<number, Post | null>(
      async (ids: readonly number[]) => {
        const posts = await this.postsService.findByIds([...ids]);
        const postMap = new Map(posts.map((p) => [p.id, p]));
        return ids.map((id) => postMap.get(id) ?? null);
      },
      { cache: true },
    );
  }

  load(id: number): Promise<Post | null> {
    return this.loader.load(id);
  }
}
