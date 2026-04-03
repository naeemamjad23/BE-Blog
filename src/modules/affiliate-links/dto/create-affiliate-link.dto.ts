import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAffiliateLinkDto {
  @ApiProperty() @IsUrl() url: string;
  @ApiProperty() @IsString() productName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() network?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() postId?: string;
}
