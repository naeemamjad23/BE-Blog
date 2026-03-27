import { PartialType } from '@nestjs/swagger';
import { CreateDomainDto } from './create-domain.dto.js';

export class UpdateDomainDto extends PartialType(CreateDomainDto) {}
