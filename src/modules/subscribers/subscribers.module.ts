import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service.js';
import { SubscribersController } from './subscribers.controller.js';

@Module({
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}
