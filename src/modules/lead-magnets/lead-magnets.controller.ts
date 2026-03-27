import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LeadMagnetsService } from './lead-magnets.service.js';
import { CreateLeadMagnetDto } from './dto/create-lead-magnet.dto.js';
import { UpdateLeadMagnetDto } from './dto/update-lead-magnet.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Lead Magnets')
@Controller('api/lead-magnets')
export class LeadMagnetsController {
  constructor(private leadMagnetsService: LeadMagnetsService) {}

  @Public() @Get()
  findAll() { return this.leadMagnetsService.findAll(); }

  @Public() @Get(':slug')
  findBySlug(@Param('slug') slug: string) { return this.leadMagnetsService.findBySlug(slug); }

  @Public() @Post(':id/download')
  trackDownload(@Param('id') id: string) { return this.leadMagnetsService.trackDownload(id); }

  @ApiBearerAuth() @Post()
  create(@Body() dto: CreateLeadMagnetDto) { return this.leadMagnetsService.create(dto); }

  @ApiBearerAuth() @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLeadMagnetDto) { return this.leadMagnetsService.update(id, dto); }

  @ApiBearerAuth() @Delete(':id')
  remove(@Param('id') id: string) { return this.leadMagnetsService.remove(id); }
}
