import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SitemapService {
  private blogUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.blogUrl = config.get('blogUrl') || 'https://blog.securemango.com';
  }

  async generateSitemap(): Promise<string> {
    const [posts, domains, series, authors] = await Promise.all([
      this.prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true, domain: { select: { slug: true } } },
      }),
      this.prisma.domain.findMany({ select: { slug: true, updatedAt: true } }),
      this.prisma.series.findMany({ select: { slug: true, updatedAt: true } }),
      this.prisma.author.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Homepage
    xml += `  <url><loc>${this.blogUrl}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;

    // Domains
    for (const d of domains) {
      xml += `  <url><loc>${this.blogUrl}/${d.slug}</loc><lastmod>${d.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    }

    // Posts
    for (const p of posts) {
      xml += `  <url><loc>${this.blogUrl}/${p.domain.slug}/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
    }

    // Series
    for (const s of series) {
      xml += `  <url><loc>${this.blogUrl}/series/${s.slug}</loc><lastmod>${s.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`;
    }

    // Authors
    for (const a of authors) {
      xml += `  <url><loc>${this.blogUrl}/author/${a.slug}</loc><lastmod>${a.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>\n`;
    }

    xml += '</urlset>';
    return xml;
  }
}
