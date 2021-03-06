import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from '../city/city.module';
import { NeuralModel } from './neural-model.entity';
import { NeuralModelController } from './neural-model.controller';
import { NeuralModelService } from './neural-model.service';
import { BullModule } from '@nestjs/bull';
import { NeuralModelProcessor } from './neural-model.processor';
import { PredictionModule } from '../prediction/prediction.module';
import { PredictorServicve } from './predictor.service';
import { OpenWeatherModule } from '../open-weather/open-weather.module';
import { TrainingData } from './training-data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NeuralModel, TrainingData]),
    BullModule.registerQueue({
      name: 'neural-model',
    }),
    CityModule,
    OpenWeatherModule,
    PredictionModule,
  ],
  providers: [NeuralModelService, NeuralModelProcessor, PredictorServicve],
  controllers: [NeuralModelController],
  exports: [NeuralModelService],
})
export class NeuralModelModule {}
