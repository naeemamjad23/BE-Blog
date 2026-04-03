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

  @Get('posts-by-day')
  postsByDay(@Query('days') days?: string) {
    return this.analyticsService.postsByDay(days ? parseInt(days) : 30);
  }

  @Get('subscribers-by-day')
  subscribersByDay(@Query('days') days?: string) {
    return this.analyticsService.subscribersByDay(days ? parseInt(days) : 30);
  }

  @Get('views-by-domain')
  viewsByDomain() { return this.analyticsService.viewsByDomain(); }

  @Get('subscribers-by-source')
  subscribersBySource() { return this.analyticsService.subscribersBySource(); }

  @Get('affiliate-stats')
  affiliateStats() { return this.analyticsService.affiliateStats(); }

  @Get('comments-by-day')
  commentsByDay(@Query('days') days?: string) {
    return this.analyticsService.commentsByDay(days ? parseInt(days) : 30);
  }
}
