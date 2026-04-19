import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Address } from './address.type';
import { Company } from './company.type';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  phone!: string;

  @Field()
  website!: string;

  @Field(() => Address, { nullable: true })
  address!: Address | null;

  @Field(() => Company, { nullable: true })
  company!: Company | null;
}
