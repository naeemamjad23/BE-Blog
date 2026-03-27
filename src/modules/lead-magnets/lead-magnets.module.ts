import { Module } from '@nestjs/common';
import { LeadMagnetsService } from './lead-magnets.service.js';
import { LeadMagnetsController } from './lead-magnets.controller.js';

@Module({
  controllers: [LeadMagnetsController],
  providers: [LeadMagnetsService],
})
export class LeadMagnetsModule {}
