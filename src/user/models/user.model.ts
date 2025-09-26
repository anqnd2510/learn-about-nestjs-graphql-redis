import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  username?: string | null;

  @Field(() => String, { nullable: true })
  phone?: string | null;
}

@ObjectType()
export class UserPaginationResponse {
  @Field(() => [User])
  data: User[];
  @Field()
  total: Number;
  @Field()
  currentPage: number;
  @Field()
  itemsPerPage: number;
}
