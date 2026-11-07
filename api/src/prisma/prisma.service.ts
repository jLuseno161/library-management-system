import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Explicitly connects to the database when the module initializes
    await this.$connect();
  }

  async onModuleDestroy() {
    // Gracefully disconnects when the application shuts down
    await this.$disconnect();
  }
}