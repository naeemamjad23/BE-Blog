import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthorsService } from './authors.service.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';
import { UpdateAuthorDto } from './dto/update-author.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Authors')
@Controller('api/authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Public() @Get()
  findAll() { return this.authorsService.findAll(); }

  @Public() @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.authorsService.findBySlug(slug); }

  @ApiBearerAuth() @Post()
  create(@Body() dto: CreateAuthorDto) { return this.authorsService.create(dto); }

  @ApiBearerAuth() @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) { return this.authorsService.update(id, dto); }

  @ApiBearerAuth() @Delete(':id')
  remove(@Param('id') id: string) { return this.authorsService.remove(id); }
}
