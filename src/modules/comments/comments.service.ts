import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId, approved: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  findPending() {
    return this.prisma.comment.findMany({
      where: { approved: false },
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateCommentDto) {
    return this.prisma.comment.create({ data: dto });
  }

  approve(id: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { approved: true },
    });
  }

  remove(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
