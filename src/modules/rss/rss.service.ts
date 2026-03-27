import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class RssService {
  private blogUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.blogUrl = config.get('blogUrl') || 'https://blog.securemango.com';
  }

  async generateFeed(): Promise<string> {
    const posts = await this.prisma.post.findMany({
      where: { published: true },
      include: { domain: true, author: true },
      orderBy: { publishedAt: 'desc' },
      take: 20,
    });

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
    xml += '<channel>\n';
    xml += '  <title>SecureMango Blog</title>\n';
    xml += `  <link>${this.blogUrl}</link>\n`;
    xml += '  <description>Cybersecurity insights across AppSec, Cloud Security, Threat Intel, and more</description>\n';
    xml += '  <language>en-us</language>\n';
    xml += `  <atom:link href="${this.blogUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n`;

    for (const post of posts) {
      xml += '  <item>\n';
      xml += `    <title><![CDATA[${post.title}]]></title>\n`;
      xml += `    <link>${this.blogUrl}/${post.domain.slug}/${post.slug}</link>\n`;
      xml += `    <guid>${this.blogUrl}/${post.domain.slug}/${post.slug}</guid>\n`;
      xml += `    <description><![CDATA[${post.excerpt}]]></description>\n`;
      xml += `    <category>${post.domain.name}</category>\n`;
      xml += `    <author>${post.author.name}</author>\n`;
      if (post.publishedAt) {
        xml += `    <pubDate>${post.publishedAt.toUTCString()}</pubDate>\n`;
      }
      xml += '  </item>\n';
    }

    xml += '</channel>\n</rss>';
    return xml;
  }
}
