import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SitemapService } from './sitemap.service.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Sitemap')
@Controller('api/sitemap')
export class SitemapController {
  constructor(private sitemapService: SitemapService) {}

  @Public()
  @Get()
  @Header('Content-Type', 'application/xml')
  generate() {
    return this.sitemapService.generateSitemap();
  }
}
