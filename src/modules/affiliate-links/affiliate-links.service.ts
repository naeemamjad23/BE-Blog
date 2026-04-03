import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAffiliateLinkDto } from './dto/create-affiliate-link.dto.js';
import { UpdateAffiliateLinkDto } from './dto/update-affiliate-link.dto.js';

@Injectable()
export class AffiliateLinksService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.affiliateLink.findMany({
      orderBy: { createdAt: 'desc' },
      include: { post: { select: { id: true, title: true, slug: true } } },
    });
  }

  async findOne(id: string) {
    const link = await this.prisma.affiliateLink.findUnique({
      where: { id },
      include: { post: { select: { id: true, title: true, slug: true } } },
    });
    if (!link) throw new NotFoundException('Affiliate link not found');
    return link;
  }

  findByPost(postId: string) {
    return this.prisma.affiliateLink.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateAffiliateLinkDto) {
    return this.prisma.affiliateLink.create({ data: dto });
  }

  update(id: string, dto: UpdateAffiliateLinkDto) {
    return this.prisma.affiliateLink.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.affiliateLink.delete({ where: { id } });
  }

  async trackClick(id: string) {
    const link = await this.prisma.affiliateLink.findUnique({ where: { id } });
    if (!link) throw new NotFoundException('Affiliate link not found');

    await this.prisma.affiliateLink.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });

    return { redirectUrl: link.url };
  }

  stats() {
    return this.prisma.affiliateLink.aggregate({
      _sum: { clickCount: true, conversionCount: true },
      _count: { id: true },
    });
  }
}
