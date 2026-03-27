import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service.js';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  overview() { return this.analyticsService.overview(); }

  @Get('top-posts')
  topPosts(@Query('limit') limit?: string) {
    return this.analyticsService.topPosts(limit ? parseInt(limit) : 10);
  }

  @Get('recent-subscribers')
  recentSubscribers(@Query('limit') limit?: string) {
    return this.analyticsService.recentSubscribers(limit ? parseInt(limit) : 10);
  }
}
