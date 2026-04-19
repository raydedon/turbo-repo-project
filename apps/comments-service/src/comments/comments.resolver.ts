import { Args, ID, Mutation, Parent, Query, ResolveField, ResolveReference, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Comment, Post } from './dto/comment.type';
import { CommentsDataLoader } from './comments.dataloader';
import { CommentsService } from './comments.service';

const pubSub = new PubSub();
const COMMENT_ADDED = 'commentAdded';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsDataLoader: CommentsDataLoader,
  ) {}

  @Query(() => [Comment], { description: 'Fetch all comments for a post' })
  comments(@Args('postId', { type: () => ID }) postId: string) {
    return this.commentsService.findByPostId(Number(postId));
  }

  /**
   * Resolves Comment.post — returns a Post representation only.
   * Apollo Router fetches the full Post from posts-service via _entities.
   */
  @ResolveField(() => Post)
  post(@Parent() comment: Comment): { __typename: string; id: number } {
    return { __typename: 'Post', id: comment.postId };
  }

  @Mutation(() => Comment, { description: 'Add a comment to a post (triggers commentAdded subscription)' })
  async addComment(
    @Args('postId', { type: () => ID }) postId: string,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('body') body: string,
  ) {
    const comment = await this.commentsService.create(Number(postId), name, email, body);
    await pubSub.publish(`${COMMENT_ADDED}_${postId}`, { commentAdded: comment });
    return comment;
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }) {
    return this.commentsDataLoader.load(Number(reference.id));
  }
}
