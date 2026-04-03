import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { EmailService } from '../email/email.service.js';
import { CreateSubscriberDto } from './dto/create-subscriber.dto.js';

@Injectable()
export class SubscribersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async subscribe(dto: CreateSubscriberDto) {
    const existing = await this.prisma.subscriber.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already subscribed');

    const verificationToken = randomBytes(32).toString('hex');

    const subscriber = await this.prisma.subscriber.create({
      data: { ...dto, verificationToken },
    });

    // Send verification email (non-blocking)
    this.emailService.sendVerificationEmail(dto.email, verificationToken);

    return { message: 'Please check your email to verify your subscription.', id: subscriber.id };
  }

  async verify(token: string) {
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { verificationToken: token },
    });
    if (!subscriber) throw new NotFoundException('Invalid or expired verification link');

    await this.prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { verified: true, verificationToken: null },
    });

    // Send welcome email after verification (non-blocking)
    this.emailService.sendWelcomeEmail(subscriber.email, subscriber.name ?? undefined);

    return { message: 'Email verified successfully. Welcome to SecureMango!' };
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
