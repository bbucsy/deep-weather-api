import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from '../city/city.module';
import { OpenWeatherModule } from '../open-weather/open-weather.module';
import { PredictionResponse } from './prediction-response.entity';
import { PredictionController } from './prediction.controller';
import { Prediction } from './prediction.entity';
import { PredictionProcessor } from './prediction.processor';
import { PredictionService } from './prediction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prediction, PredictionResponse]),
    BullModule.registerQueue({
      name: 'predictor',
    }),
    CityModule,
    OpenWeatherModule,
  ],
  providers: [PredictionService, PredictionProcessor],
  controllers: [PredictionController],
  exports: [PredictionService],
})
export class PredictionModule {}
