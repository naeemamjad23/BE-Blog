import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubscribersService } from './subscribers.service.js';
import { CreateSubscriberDto } from './dto/create-subscriber.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Subscribers')
@Controller('api/subscribers')
export class SubscribersController {
  constructor(private subscribersService: SubscribersService) {}

  @Public()
  @Post()
  subscribe(@Body() dto: CreateSubscriberDto) {
    return this.subscribersService.subscribe(dto);
  }

  @Public()
  @Get('verify/:token')
  verify(@Param('token') token: string) {
    return this.subscribersService.verify(token);
  }

  @Public()
  @Delete('unsubscribe/:email')
  unsubscribe(@Param('email') email: string) {
    return this.subscribersService.unsubscribe(email);
  }

  @ApiBearerAuth()
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.subscribersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @ApiBearerAuth()
  @Get('count')
  count() {
    return this.subscribersService.count();
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscribersService.remove(id);
  }
}
