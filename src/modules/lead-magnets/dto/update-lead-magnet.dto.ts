import { PartialType } from '@nestjs/swagger';
import { CreateLeadMagnetDto } from './create-lead-magnet.dto.js';

export class UpdateLeadMagnetDto extends PartialType(CreateLeadMagnetDto) {}
