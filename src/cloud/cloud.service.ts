import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUsageInput } from '../user/dto/usage.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CloudService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createUsage(userId: number, input: CreateUsageInput) {
    const pricing = await this.prisma.pricing.findUnique({
      where: { id: input.pricingId },
    });
    if (!pricing) throw new NotFoundException('Pricing not found');

    const usage = await this.prisma.usage.create({
      data: {
        userId,
        pricingId: input.pricingId,
        vcpu: input.vcpu,
        memoryGb: input.memoryGb,
        storageGb: input.storageGb,
        bandwidthGb: input.bandwidthGb,
        hours: input.hours,
      },
      include: { pricing: true },
    });

    const cost =
      (usage.vcpu * usage.pricing.vcpuRate +
        usage.memoryGb * usage.pricing.memoryRate +
        usage.storageGb * usage.pricing.storageRate +
        usage.bandwidthGb * usage.pricing.bandwidthRate) *
      usage.hours;

    return { ...usage, cost };
  }

  async getUserUsages(userId: number) {
    const usages = await this.prisma.usage.findMany({
      where: { userId },
      include: { pricing: true },
    });

    return usages.map((u) => ({
      ...u,
      cost:
        (u.vcpu * u.pricing.vcpuRate +
          u.memoryGb * u.pricing.memoryRate +
          u.storageGb * u.pricing.storageRate +
          u.bandwidthGb * u.pricing.bandwidthRate) *
        u.hours,
    }));
  }

  async getPricing(provider: string) {
    // check cache
    const cached = await this.redis.get(`pricing:${provider}`);
    if (cached) {
      console.log(`⚡ Cache hit for ${provider}`);
      return JSON.parse(cached); // data from Redis
    }

    // query db
    const pricing = await this.prisma.pricing.findFirst({
      where: { provider },
    });
    if (!pricing) throw new NotFoundException('Pricing not found');

    // set cache 1h
    await this.redis.set(
      `pricing:${provider}`,
      JSON.stringify(pricing),
      3600, // TTL = 3600s
    );

    return pricing;
  }
}
