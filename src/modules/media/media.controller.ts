import { Controller, Post, Get, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { MediaService } from './media.service.js';

@ApiTags('Media')
@ApiBearerAuth()
@Controller('api/media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.upload(file);
  }

  @Get()
  list() {
    return this.mediaService.list();
  }

  @Delete(':filename')
  remove(@Param('filename') filename: string) {
    return this.mediaService.remove(filename);
  }
}
