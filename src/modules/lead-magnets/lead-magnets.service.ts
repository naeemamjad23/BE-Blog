import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateLeadMagnetDto } from './dto/create-lead-magnet.dto.js';
import { UpdateLeadMagnetDto } from './dto/update-lead-magnet.dto.js';

@Injectable()
export class LeadMagnetsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.leadMagnet.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findBySlug(slug: string) {
    const lm = await this.prisma.leadMagnet.findUnique({ where: { slug } });
    if (!lm) throw new NotFoundException('Lead magnet not found');
    return lm;
  }

  async trackDownload(id: string) {
    return this.prisma.leadMagnet.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });
  }

  create(dto: CreateLeadMagnetDto) {
    return this.prisma.leadMagnet.create({ data: dto });
  }

  update(id: string, dto: UpdateLeadMagnetDto) {
    return this.prisma.leadMagnet.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.leadMagnet.delete({ where: { id } });
  }
}
