import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { CloudService } from './cloud.service';
import { CreateUsageInput } from 'src/user/dto/usage.dto';
import { Pricing } from './models/pricing.model';

@Resolver()
export class CloudResolver {
  constructor(private cloudService: CloudService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async createUsage(
    @Context() context,
    @Args('input') input: CreateUsageInput,
  ) {
    const user = context.req.user; // lấy từ req.user
    const usage = await this.cloudService.createUsage(user.id, input);
    return `Usage recorded. Cost = $${usage.cost.toFixed(2)}`;
  }

  @UseGuards(AuthGuard)
  @Query(() => [String])
  async myUsages(@Context() context) {
    const user = context.req.user;
    const usages = await this.cloudService.getUserUsages(user.id);
    return usages.map(
      (u) =>
        `Provider: ${u.pricing.provider}, vCPU: ${u.vcpu}, RAM: ${u.memoryGb}GB, Cost: $${u.cost.toFixed(
          2,
        )}`,
    );
  }
  @UseGuards(AuthGuard)
  @Query(() => Pricing)
  async getPricing(@Args('provider') provider: string) {
    return this.cloudService.getPricing(provider);
  }
}
