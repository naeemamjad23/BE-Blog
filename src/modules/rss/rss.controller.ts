import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RssService } from './rss.service.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('RSS')
@Controller('api/rss')
export class RssController {
  constructor(private rssService: RssService) {}

  @Public()
  @Get()
  @Header('Content-Type', 'application/rss+xml')
  generate() {
    return this.rssService.generateFeed();
  }
}
