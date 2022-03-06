import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';

@Module({
  providers: [PredictionService],
})
export class PredictionModule {}
