import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSeriesDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsIn(['beginner', 'intermediate', 'advanced']) difficulty: string;
  @ApiProperty() @IsString() domainId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() coverImage?: string;
}
