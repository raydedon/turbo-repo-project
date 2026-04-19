import { Args, ID, Query, ResolveReference, Resolver } from '@nestjs/graphql';
import { User } from './dto/user.type';
import { UsersDataLoader } from './users.dataloader';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersDataLoader: UsersDataLoader,
  ) {}

  @Query(() => [User], { description: 'Fetch all users' })
  users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { nullable: true, description: 'Fetch a user by ID' })
  user(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
    return this.usersService.findById(Number(id));
  }

  /**
   * Federation entity resolver — called by Apollo Router when another subgraph
   * references a User by ID. DataLoader batches all incoming IDs into one DB query.
   */
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }): Promise<User | null> {
    return this.usersDataLoader.load(Number(reference.id));
  }
}
