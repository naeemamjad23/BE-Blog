import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import configuration from './config/configuration.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { PostsModule } from './modules/posts/posts.module.js';
import { DomainsModule } from './modules/domains/domains.module.js';
import { SeriesModule } from './modules/series/series.module.js';
import { TagsModule } from './modules/tags/tags.module.js';
import { AuthorsModule } from './modules/authors/authors.module.js';
import { MediaModule } from './modules/media/media.module.js';
import { SubscribersModule } from './modules/subscribers/subscribers.module.js';
import { LeadMagnetsModule } from './modules/lead-magnets/lead-magnets.module.js';
import { CommentsModule } from './modules/comments/comments.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { SitemapModule } from './modules/sitemap/sitemap.module.js';
import { RssModule } from './modules/rss/rss.module.js';
import { EmailModule } from './modules/email/email.module.js';
import { AffiliateLinksModule } from './modules/affiliate-links/affiliate-links.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    PostsModule,
    DomainsModule,
    SeriesModule,
    TagsModule,
    AuthorsModule,
    MediaModule,
    SubscribersModule,
    LeadMagnetsModule,
    CommentsModule,
    AnalyticsModule,
    SitemapModule,
    RssModule,
    EmailModule,
    AffiliateLinksModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
