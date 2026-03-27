import { Module } from '@nestjs/common';
import { SitemapService } from './sitemap.service.js';
import { SitemapController } from './sitemap.controller.js';

@Module({
  controllers: [SitemapController],
  providers: [SitemapService],
})
export class SitemapModule {}
