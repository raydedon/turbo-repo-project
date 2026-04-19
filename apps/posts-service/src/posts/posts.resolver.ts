import { Args, ID, Int, Mutation, Parent, Query, ResolveField, ResolveReference, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Post, PostsPage, User } from './dto/post.type';
import { PostsDataLoader } from './posts.dataloader';
import { PostsService } from './posts.service';

const pubSub = new PubSub();
const POST_PUBLISHED = 'postPublished';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsDataLoader: PostsDataLoader,
  ) {}

  @Query(() => PostsPage, { description: 'Paginated posts in chronological order' })
  posts(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('perPage', { type: () => Int, defaultValue: 10 }) perPage: number,
  ) {
    return this.postsService.findAll(page, perPage);
  }

  @Query(() => Post, { nullable: true, description: 'Fetch a post by ID' })
  post(@Args('id', { type: () => ID }) id: string) {
    return this.postsService.findById(Number(id));
  }

  @Query(() => [Post], { description: 'Fetch all posts by a user' })
  postsByUser(@Args('userId', { type: () => ID }) userId: string) {
    return this.postsService.findByUserId(Number(userId));
  }

  /**
   * Resolves Post.author — returns a User representation only.
   * Apollo Router takes this { __typename, id } and fetches the full User
   * from users-service via the _entities query (batched automatically).
   */
  @ResolveField(() => User)
  author(@Parent() post: Post): { __typename: string; id: number } {
    return { __typename: 'User', id: post.userId };
  }

  @Mutation(() => Post, { description: 'Create a new post (triggers postPublished subscription)' })
  async createPost(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('title') title: string,
    @Args('body') body: string,
  ) {
    const post = await this.postsService.create(Number(userId), title, body);
    await pubSub.publish(POST_PUBLISHED, { postPublished: post });
    return post;
  }

  /**
   * Federation entity resolver — batches __resolveReference calls via DataLoader.
   */
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }) {
    return this.postsDataLoader.load(Number(reference.id));
  }
}
