import { Module } from '@nestjs/common';
import { SeriesService } from './series.service.js';
import { SeriesController } from './series.controller.js';

@Module({
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
