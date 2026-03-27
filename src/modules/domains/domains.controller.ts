import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DomainsService } from './domains.service.js';
import { CreateDomainDto } from './dto/create-domain.dto.js';
import { UpdateDomainDto } from './dto/update-domain.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Domains')
@Controller('api/domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}

  @Public()
  @Get()
  findAll() {
    return this.domainsService.findAll();
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.domainsService.findBySlug(slug);
  }

  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateDomainDto) {
    return this.domainsService.create(dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDomainDto) {
    return this.domainsService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.domainsService.remove(id);
  }
}
