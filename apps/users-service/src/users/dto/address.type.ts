import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Geo {
  @Field(() => String)
  lat!: string;

  @Field(() => String)
  lng!: string;
}

@ObjectType()
export class Address {
  @Field(() => String)
  street!: string;

  @Field(() => String)
  suite!: string;

  @Field(() => String)
  city!: string;

  @Field(() => String)
  zipcode!: string;

  @Field(() => Geo)
  geo!: Geo;
}
