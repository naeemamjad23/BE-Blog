import { IsString, IsOptional, IsBoolean, IsInt, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsString() excerpt: string;
  @ApiProperty() @IsString() content: string;
  @ApiProperty() @IsString() domainId: string;
  @ApiProperty() @IsString() authorId: string;

  @ApiPropertyOptional() @IsOptional() @IsString() coverImage?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() published?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsDateString() publishedAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() featured?: boolean;

  // SEO
  @ApiPropertyOptional() @IsOptional() @IsString() metaTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() metaDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() canonicalUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ogImage?: string;

  // Monetization
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPremium?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isSponsored?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() sponsorName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sponsorUrl?: string;

  // Series
  @ApiPropertyOptional() @IsOptional() @IsString() seriesId?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() seriesOrder?: number;

  // Tags (array of tag IDs)
  @ApiPropertyOptional() @IsOptional() @IsArray() @IsString({ each: true }) tagIds?: string[];

  @ApiPropertyOptional() @IsOptional() @IsInt() readTimeMin?: number;
}
