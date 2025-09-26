import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
    this.client.on('connect', () => {
      console.log('✅ Connected to Redis');
    });
    this.client.on('error', (err) => {
      console.error('❌ Redis error', err);
    });
  }
  async onModuleDestroy() {
    await this.client.quit();
  }
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, expireSeconds?: number) {
    if (expireSeconds) {
      return this.client.set(key, value, 'EX', expireSeconds);
    }
    return this.client.set(key, value);
  }
  async del(key: string) {
    return this.client.del(key);
  }
}
