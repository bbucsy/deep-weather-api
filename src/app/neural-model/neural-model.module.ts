import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from '../city/city.module';
import { NeuralModel } from './neural-model.entity';
import { NeuralModelController } from './neural-model.controller';
import { NeuralModelService } from './neural-model.service';
import { BullModule } from '@nestjs/bull';
import { NeuralModelProcessor } from './neural-model.processor';
import { PredictionModule } from '../prediction/prediction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NeuralModel]),
    BullModule.registerQueue({
      name: 'neural-model',
    }),
    CityModule,
    PredictionModule,
  ],
  providers: [NeuralModelService, NeuralModelProcessor],
  controllers: [NeuralModelController],
  exports: [NeuralModelService],
})
export class NeuralModelModule {}
