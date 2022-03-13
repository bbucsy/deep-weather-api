import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from '../city/city.module';
import { NeuralModel } from './neural-model.entity';
import { OpenWeatherModule } from '../open-weather/open-weather.module';
import { NeuralModelController } from './neural-model.controller';
import { NeuralModelService } from './neural-model.service';
import { BullModule } from '@nestjs/bull';
import { NeuralModelProcessor } from './neural-model.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([NeuralModel]),
    BullModule.registerQueue({
      name: 'neural-model',
    }),
    CityModule,
    OpenWeatherModule,
  ],
  providers: [NeuralModelService, NeuralModelProcessor],
  controllers: [NeuralModelController],
  exports: [NeuralModelService],
})
export class NeuralModelModule {}
