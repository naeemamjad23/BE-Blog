import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateDomainDto } from './dto/create-domain.dto.js';
import { UpdateDomainDto } from './dto/update-domain.dto.js';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.domain.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { posts: true, series: true } } },
    });
  }

  async findBySlug(slug: string) {
    const domain = await this.prisma.domain.findUnique({
      where: { slug },
      include: { _count: { select: { posts: true, series: true } } },
    });
    if (!domain) throw new NotFoundException('Domain not found');
    return domain;
  }

  create(dto: CreateDomainDto) {
    return this.prisma.domain.create({ data: dto });
  }

  async update(id: string, dto: UpdateDomainDto) {
    return this.prisma.domain.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.domain.delete({ where: { id } });
  }
}
