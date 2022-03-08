import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeuralModel } from './neural-model.entity';
import { PredictionService } from './prediction.service';

@Module({
  imports: [TypeOrmModule.forFeature([NeuralModel])],
  providers: [PredictionService],
})
export class PredictionModule {}
