import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Tags')
@Controller('api/tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Public() @Get()
  findAll() { return this.tagsService.findAll(); }

  @ApiBearerAuth() @Post()
  create(@Body() dto: CreateTagDto) { return this.tagsService.create(dto); }

  @ApiBearerAuth() @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) { return this.tagsService.update(id, dto); }

  @ApiBearerAuth() @Delete(':id')
  remove(@Param('id') id: string) { return this.tagsService.remove(id); }
}
