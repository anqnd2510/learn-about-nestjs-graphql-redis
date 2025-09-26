import { Module } from '@nestjs/common';
import { CloudResolver } from './cloud.resolver';
import { CloudService } from './cloud.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Module({
  providers: [
    CloudResolver,
    CloudService,
    PrismaService,
    JwtService,
    RedisService,
  ],
})
export class CloudModule {}
