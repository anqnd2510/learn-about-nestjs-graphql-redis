import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
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
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: CreateUsageInput,
  ) {
    const usage = await this.cloudService.createUsage(userId, input);
    return `Usage recorded. Cost = $${usage.cost.toFixed(2)}`;
  }

  @UseGuards(AuthGuard)
  @Query(() => [String])
  async myUsages(@Args('userId', { type: () => Int }) userId: number) {
    const usages = await this.cloudService.getUserUsages(userId);
    return usages.map(
      (u) =>
        `Provider: ${u.pricing.provider}, vCPU: ${u.vcpu}, RAM: ${u.memoryGb}GB, Storage: ${u.storageGb}GB, Bandwidth: ${u.bandwidthGb}GB, Total Cost: $${u.cost.toFixed(
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
