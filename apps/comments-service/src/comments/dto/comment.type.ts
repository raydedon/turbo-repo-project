import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Post stub — defined in posts-service, referenced here for federation.
 * resolvable: false means this service only provides postId as a join key.
 */
@ObjectType()
@Directive('@key(fields: "id", resolvable: false)')
export class Post {
  @Field(() => ID)
  id!: number;
}

/**
 * User stub — defined in users-service, referenced here for federation.
 * resolvable: false means this service only provides userId as a join key.
 */
@ObjectType()
@Directive('@key(fields: "id", resolvable: false)')
export class User {
  @Field(() => ID)
  id!: number;
}

@ObjectType()
@Directive('@key(fields: "id")')
export class Comment {
  @Field(() => ID)
  id!: number;

  @Field(() => ID)
  postId!: number;

  @Field(() => ID)
  userId!: number;

  @Field(() => User)
  user?: User;

  @Field()
  body!: string;
}
