import { PartialType } from '@nestjs/swagger';
import { CreateSeriesDto } from './create-series.dto.js';

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {}
