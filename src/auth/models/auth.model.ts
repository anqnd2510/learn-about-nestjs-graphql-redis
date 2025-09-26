import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class loginResponse {
  @Field({ nullable: true })
  accessToken?: string;
}
