import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private readonly includeRelations = {
    domain: true,
    author: true,
    series: true,
    tags: { include: { tag: true } },
    _count: { select: { comments: true } },
  };

  async findAll(query: {
    page?: number;
    limit?: number;
    domainSlug?: string;
    featured?: boolean;
    published?: boolean;
    search?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const where: any = {};

    if (query.published !== undefined) where.published = query.published;
    if (query.featured) where.featured = true;
    if (query.domainSlug) where.domain = { slug: query.domainSlug };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: this.includeRelations,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: this.includeRelations,
    });
    if (!post) throw new NotFoundException('Post not found');

    // Increment view count
    await this.prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async findByDomain(domainSlug: string, page = 1, limit = 12) {
    return this.findAll({ domainSlug, published: true, page, limit });
  }

  async findRelated(postId: string, limit = 4) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { tags: true },
    });
    if (!post) return [];

    return this.prisma.post.findMany({
      where: {
        id: { not: postId },
        published: true,
        OR: [
          { domainId: post.domainId },
          { tags: { some: { tagId: { in: post.tags.map((t) => t.tagId) } } } },
        ],
      },
      include: { domain: true, author: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async create(dto: CreatePostDto) {
    const { tagIds, publishedAt, ...data } = dto;

    const post = await this.prisma.post.create({
      data: {
        ...data,
        publishedAt: publishedAt ? new Date(publishedAt) : data.published ? new Date() : null,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: this.includeRelations,
    });

    return post;
  }

  async update(id: string, dto: UpdatePostDto) {
    const { tagIds, publishedAt, ...data } = dto;

    if (tagIds !== undefined) {
      await this.prisma.postTag.deleteMany({ where: { postId: id } });
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: this.includeRelations,
    });
  }

  async remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
