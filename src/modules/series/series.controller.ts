import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SeriesService } from './series.service.js';
import { CreateSeriesDto } from './dto/create-series.dto.js';
import { UpdateSeriesDto } from './dto/update-series.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Series')
@Controller('api/series')
export class SeriesController {
  constructor(private seriesService: SeriesService) {}

  @Public() @Get()
  findAll() { return this.seriesService.findAll(); }

  @Public() @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.seriesService.findBySlug(slug); }

  @Public() @Get('domain/:domainSlug')
  findByDomain(@Param('domainSlug') domainSlug: string) { return this.seriesService.findByDomain(domainSlug); }

  @ApiBearerAuth() @Post()
  create(@Body() dto: CreateSeriesDto) { return this.seriesService.create(dto); }

  @ApiBearerAuth() @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSeriesDto) { return this.seriesService.update(id, dto); }

  @ApiBearerAuth() @Delete(':id')
  remove(@Param('id') id: string) { return this.seriesService.remove(id); }
}
