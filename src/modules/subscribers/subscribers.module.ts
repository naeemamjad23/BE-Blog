import { Module } from '@nestjs/common';
import { SubscribersService } from './subscribers.service.js';
import { SubscribersController } from './subscribers.controller.js';
import { EmailModule } from '../email/email.module.js';

@Module({
  imports: [EmailModule],
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}
