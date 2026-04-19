import { Injectable, Scope } from "@nestjs/common";
import DataLoader from "dataloader";
import { CommentsService } from "./comments.service";
import { Comment } from "./dto/comment.type";

/**
 * REQUEST-scoped DataLoader for Comment entity resolution.
 * Batches __resolveReference calls into one DB query per request.
 */
@Injectable({ scope: Scope.REQUEST })
export class CommentsDataLoader {
  private readonly loader: DataLoader<number, Comment | null>;

  constructor(private readonly commentsService: CommentsService) {
    this.loader = new DataLoader<number, Comment | null>(
      async (ids: readonly number[]) => {
        const comments: Comment[] = await this.commentsService.findByIds([
          ...ids,
        ]);
        const map = new Map(comments.map((c) => [c.id, c]));
        return ids.map((id) => map.get(id) ?? null);
      },
      { cache: true },
    );
  }

  load(id: number): Promise<Comment | null> {
    return this.loader.load(id);
  }
}
