import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

@Injectable()
export class MediaService {
  private uploadDir: string;

  constructor(private config: ConfigService) {
    this.uploadDir = config.get('upload.dir') || '/var/www/Blog/uploads';
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();
    const filename = `${timestamp}-${safeName}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return {
      filename,
      url: `/uploads/${filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async compress(filename: string) {
    const filepath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filepath)) throw new NotFoundException('File not found');

    const ext = path.extname(filename).toLowerCase();
    const originalSize = fs.statSync(filepath).size;

    if (ext === '.png') {
      execSync(`pngquant --quality=65-80 --force --ext .png "${filepath}"`);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      // jpegoptim not always available, use cwebp round-trip or skip
      throw new BadRequestException('JPEG compression not supported yet. Convert to WebP instead.');
    } else {
      throw new BadRequestException(`Cannot compress ${ext} files. Try converting to WebP.`);
    }

    const newSize = fs.statSync(filepath).size;

    return {
      filename,
      url: `/uploads/${filename}`,
      originalSize,
      compressedSize: newSize,
      saved: originalSize - newSize,
      savedPercent: Math.round(((originalSize - newSize) / originalSize) * 100),
    };
  }

  async convertToWebp(filename: string, quality = 80) {
    const filepath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filepath)) throw new NotFoundException('File not found');

    const ext = path.extname(filename).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.tiff'].includes(ext)) {
      throw new BadRequestException(`Cannot convert ${ext} to WebP.`);
    }

    const originalSize = fs.statSync(filepath).size;
    const webpFilename = filename.replace(/\.[^.]+$/, '.webp');
    const webpPath = path.join(this.uploadDir, webpFilename);

    execSync(`cwebp -q ${quality} "${filepath}" -o "${webpPath}"`);

    const newSize = fs.statSync(webpPath).size;

    return {
      filename: webpFilename,
      url: `/uploads/${webpFilename}`,
      originalSize,
      convertedSize: newSize,
      saved: originalSize - newSize,
      savedPercent: Math.round(((originalSize - newSize) / originalSize) * 100),
    };
  }

  async list() {
    const files = fs.readdirSync(this.uploadDir);
    return files.map((filename) => {
      const filepath = path.join(this.uploadDir, filename);
      const stats = fs.statSync(filepath);
      return {
        filename,
        url: `/uploads/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    });
  }

  async remove(filename: string) {
    const filepath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    return { deleted: true };
  }
}
