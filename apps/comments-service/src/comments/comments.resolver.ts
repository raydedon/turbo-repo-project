import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  ResolveReference,
  Resolver,
} from "@nestjs/graphql";
import { Comment, Post, User } from "./dto/comment.type";
import { CommentsDataLoader } from "./comments.dataloader";
import { CommentsService } from "./comments.service";

const COMMENT_ADDED = "commentAdded";

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsDataLoader: CommentsDataLoader,
  ) {}

  @Query(() => [Comment], { description: "Fetch all comments for a post" })
  comments(@Args("postId", { type: () => ID }) postId: string) {
    return this.commentsService.findByPostId(Number(postId));
  }

  /**
   * Resolves Comment.post — returns a Post representation only.
   * Apollo Router fetches the full Post from posts-service via _entities.
   */
  @ResolveField(() => Post)
  post(@Parent() comment: Comment): { __typename: string; id: number } {
    return { __typename: "Post", id: comment.postId };
  }

  @ResolveField(() => User)
  user(@Parent() comment: Comment): { __typename: string; id: number } {
    return { __typename: "User", id: comment.userId };
  }

  @Mutation(() => Comment, {
    description: "Add a comment to a post",
  })
  async addComment(
    @Args("postId", { type: () => ID }) postId: string,
    @Args("body") body: string,
    @Args("userId", { type: () => ID }) userId: string,
  ) {
    return this.commentsService.create(Number(postId), body, Number(userId));
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }) {
    return this.commentsDataLoader.load(Number(reference.id));
  }
}
