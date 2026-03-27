import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';
import { UpdateAuthorDto } from './dto/update-author.dto.js';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.author.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const author = await this.prisma.author.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { published: true },
          include: { domain: true },
          orderBy: { publishedAt: 'desc' },
        },
      },
    });
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  create(dto: CreateAuthorDto) { return this.prisma.author.create({ data: dto }); }

  update(id: string, dto: UpdateAuthorDto) {
    return this.prisma.author.update({ where: { id }, data: dto });
  }

  remove(id: string) { return this.prisma.author.delete({ where: { id } }); }
}
