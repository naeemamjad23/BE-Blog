import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSeriesDto } from './dto/create-series.dto.js';
import { UpdateSeriesDto } from './dto/update-series.dto.js';

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.series.findMany({
      include: {
        domain: true,
        _count: { select: { posts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const series = await this.prisma.series.findUnique({
      where: { slug },
      include: {
        domain: true,
        posts: {
          where: { published: true },
          include: { author: true },
          orderBy: { seriesOrder: 'asc' },
        },
      },
    });
    if (!series) throw new NotFoundException('Series not found');
    return series;
  }

  findByDomain(domainSlug: string) {
    return this.prisma.series.findMany({
      where: { domain: { slug: domainSlug } },
      include: { domain: true, _count: { select: { posts: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateSeriesDto) {
    return this.prisma.series.create({ data: dto, include: { domain: true } });
  }

  update(id: string, dto: UpdateSeriesDto) {
    return this.prisma.series.update({ where: { id }, data: dto, include: { domain: true } });
  }

  remove(id: string) {
    return this.prisma.series.delete({ where: { id } });
  }
}
