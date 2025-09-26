import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUsageInput {
  @Field(() => Int)
  @IsInt()
  pricingId: number; // choose provider from Pricing table

  @Field(() => Int)
  vcpu: number;

  @Field(() => Int)
  memoryGb: number;

  @Field(() => Int)
  storageGb: number;

  @Field(() => Int)
  bandwidthGb: number;

  @Field(() => Int, { defaultValue: 730 })
  hours: number;
}
