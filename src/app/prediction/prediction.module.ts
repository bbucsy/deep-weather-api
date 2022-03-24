import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from '../city/city.module';
import { PredictionResponse } from './prediction-response.entity';
import { PredictionController } from './prediction.controller';
import { Prediction } from './prediction.entity';
import { PredictionService } from './prediction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prediction, PredictionResponse]),
    CityModule,
  ],
  providers: [PredictionService],
  controllers: [PredictionController],
  exports: [PredictionService],
})
export class PredictionModule {}
