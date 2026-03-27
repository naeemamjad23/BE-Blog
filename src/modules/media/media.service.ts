import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

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
