import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Comments')
@Controller('api/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Public() @Get('post/:postId')
  findByPost(@Param('postId') postId: string) { return this.commentsService.findByPost(postId); }

  @Public() @Post()
  create(@Body() dto: CreateCommentDto) { return this.commentsService.create(dto); }

  @ApiBearerAuth() @Get('pending')
  findPending() { return this.commentsService.findPending(); }

  @ApiBearerAuth() @Patch(':id/approve')
  approve(@Param('id') id: string) { return this.commentsService.approve(id); }

  @ApiBearerAuth() @Delete(':id')
  remove(@Param('id') id: string) { return this.commentsService.remove(id); }
}
