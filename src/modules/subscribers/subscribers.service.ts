import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateSubscriberDto } from './dto/create-subscriber.dto.js';

@Injectable()
export class SubscribersService {
  constructor(private prisma: PrismaService) {}

  async subscribe(dto: CreateSubscriberDto) {
    const existing = await this.prisma.subscriber.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already subscribed');

    return this.prisma.subscriber.create({ data: dto });
  }

  findAll(page = 1, limit = 50) {
    return this.prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  count() {
    return this.prisma.subscriber.count();
  }

  remove(id: string) {
    return this.prisma.subscriber.delete({ where: { id } });
  }

  unsubscribe(email: string) {
    return this.prisma.subscriber.delete({ where: { email } });
  }
}
