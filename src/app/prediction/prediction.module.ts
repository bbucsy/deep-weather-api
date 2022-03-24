import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './prediction.entity';
import { PredictionService } from './prediction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prediction])],
  providers: [PredictionService],
  exports: [PredictionService],
})
export class PredictionModule {}
