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
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        publishedAt: true,
        domain: { select: { name: true, slug: true, color: true } },
      },
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

  /** Posts published per day over the last N days */
  async postsByDay(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const posts = await this.prisma.post.findMany({
      where: { published: true, publishedAt: { gte: since } },
      select: { publishedAt: true },
      orderBy: { publishedAt: 'asc' },
    });

    return this.bucketByDay(posts, 'publishedAt', days);
  }

  /** Subscriber signups per day over the last N days */
  async subscribersByDay(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const subs = await this.prisma.subscriber.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    return this.bucketByDay(subs, 'createdAt', days);
  }

  /** View counts grouped by domain */
  async viewsByDomain() {
    const domains = await this.prisma.domain.findMany({
      select: {
        name: true,
        slug: true,
        color: true,
        posts: { select: { viewCount: true }, where: { published: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return domains.map((d) => ({
      name: d.name,
      slug: d.slug,
      color: d.color,
      views: d.posts.reduce((sum, p) => sum + p.viewCount, 0),
      postCount: d.posts.length,
    }));
  }

  /** Subscriber breakdown by source */
  async subscribersBySource() {
    const subs = await this.prisma.subscriber.groupBy({
      by: ['source'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return subs.map((s) => ({
      source: s.source || 'direct',
      count: s._count.id,
    }));
  }

  /** Affiliate link performance summary */
  async affiliateStats() {
    const links = await this.prisma.affiliateLink.findMany({
      select: {
        id: true,
        productName: true,
        network: true,
        clickCount: true,
        conversionCount: true,
        post: { select: { title: true, slug: true } },
      },
      orderBy: { clickCount: 'desc' },
      take: 20,
    });

    const totals = await this.prisma.affiliateLink.aggregate({
      _sum: { clickCount: true, conversionCount: true },
      _count: { id: true },
    });

    return {
      links,
      totals: {
        totalLinks: totals._count.id,
        totalClicks: totals._sum.clickCount || 0,
        totalConversions: totals._sum.conversionCount || 0,
      },
    };
  }

  /** Comments per day over the last N days */
  async commentsByDay(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const comments = await this.prisma.comment.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    return this.bucketByDay(comments, 'createdAt', days);
  }

  /** Helper: bucket records into { date, count } per day */
  private bucketByDay(records: Record<string, any>[], dateField: string, days: number) {
    const map = new Map<string, number>();

    // Pre-fill all days with 0
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().split('T')[0], 0);
    }

    for (const record of records) {
      const key = new Date(record[dateField]).toISOString().split('T')[0];
      map.set(key, (map.get(key) || 0) + 1);
    }

    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
  }
}
