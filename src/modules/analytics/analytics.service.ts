import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [totalPosts, publishedPosts, totalViews, totalSubscribers, totalComments, pendingComments] =
      await Promise.all([
        this.prisma.post.count(),
        this.prisma.post.count({ where: { published: true } }),
        this.prisma.post.aggregate({ _sum: { viewCount: true } }),
        this.prisma.subscriber.count(),
        this.prisma.comment.count(),
        this.prisma.comment.count({ where: { approved: false } }),
      ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts: totalPosts - publishedPosts,
      totalViews: totalViews._sum.viewCount || 0,
      totalSubscribers,
      totalComments,
      pendingComments,
    };
  }

  async topPosts(limit = 10) {
    return this.prisma.post.findMany({
      where: { published: true },
      select: { id: true, title: true, slug: true, viewCount: true, publishedAt: true },
      orderBy: { viewCount: 'desc' },
      take: limit,
    });
  }

  async recentSubscribers(limit = 10) {
    return this.prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
