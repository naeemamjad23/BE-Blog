import { Module } from '@nestjs/common';
import { AffiliateLinksService } from './affiliate-links.service.js';
import { AffiliateLinksController } from './affiliate-links.controller.js';

@Module({
  controllers: [AffiliateLinksController],
  providers: [AffiliateLinksService],
  exports: [AffiliateLinksService],
})
export class AffiliateLinksModule {}
