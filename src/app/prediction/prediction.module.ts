import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeuralModelModule } from '../neural-model/neural-model.module';
import { OpenWeatherModule } from '../open-weather/open-weather.module';
import { Prediction } from './prediction.entity';
import { PredictionService } from './prediction.service';

@Module({
  imports: [
    OpenWeatherModule,
    NeuralModelModule,
    TypeOrmModule.forFeature([Prediction]),
  ],
  providers: [PredictionService],
  exports: [PredictionService],
})
export class PredictionModule {}
