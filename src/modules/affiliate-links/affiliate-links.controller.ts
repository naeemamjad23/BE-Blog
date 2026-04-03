import { Controller, Get, Post, Patch, Delete, Param, Body, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { AffiliateLinksService } from './affiliate-links.service.js';
import { CreateAffiliateLinkDto } from './dto/create-affiliate-link.dto.js';
import { UpdateAffiliateLinkDto } from './dto/update-affiliate-link.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('Affiliate Links')
@Controller('api/affiliate-links')
export class AffiliateLinksController {
  constructor(private affiliateLinksService: AffiliateLinksService) {}

  /** Public: track click and redirect to affiliate URL */
  @Public()
  @Get(':id/click')
  async trackClick(@Param('id') id: string, @Res() res: Response) {
    const { redirectUrl } = await this.affiliateLinksService.trackClick(id);
    return res.redirect(302, redirectUrl);
  }

  /** Public: get affiliate links for a post (frontend use) */
  @Public()
  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.affiliateLinksService.findByPost(postId);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.affiliateLinksService.findAll();
  }

  @ApiBearerAuth()
  @Get('stats')
  stats() {
    return this.affiliateLinksService.stats();
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.affiliateLinksService.findOne(id);
  }

  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateAffiliateLinkDto) {
    return this.affiliateLinksService.create(dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAffiliateLinkDto) {
    return this.affiliateLinksService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.affiliateLinksService.remove(id);
  }
}
