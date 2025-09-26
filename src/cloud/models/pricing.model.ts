import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pricing {
  @Field(() => Int)
  id: number;

  @Field()
  provider: string;

  @Field(() => Float)
  vcpuRate: number;

  @Field(() => Float)
  memoryRate: number;

  @Field(() => Float)
  storageRate: number;

  @Field(() => Float)
  bandwidthRate: number;
}
