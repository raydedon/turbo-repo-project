import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';

/**
 * User is defined in users-service. Here we declare a stub so posts-service
 * can reference it as a federation entity without re-implementing it.
 * resolvable: false tells the Router this service cannot resolve User fields —
 * it only contributes the id as a join key.
 */
@ObjectType()
@Directive('@key(fields: "id", resolvable: false)')
export class User {
  @Field(() => ID)
  id!: number;
}

@ObjectType()
@Directive('@key(fields: "id")')
export class Post {
  @Field(() => ID)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field()
  title!: string;

  @Field()
  body!: string;

  @Field()
  publishedAt!: string;
}

@ObjectType()
export class PostsPage {
  @Field(() => [Post])
  posts!: Post[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  perPage!: number;
}
