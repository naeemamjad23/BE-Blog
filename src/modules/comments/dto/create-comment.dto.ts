import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty() @IsString() content: string;
  @ApiProperty() @IsString() authorName: string;
  @ApiProperty() @IsEmail() authorEmail: string;
  @ApiProperty() @IsString() postId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() parentId?: string;
}
