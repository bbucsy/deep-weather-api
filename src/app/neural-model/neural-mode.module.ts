import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from '../city/city.module';
import { NeuralModel } from '../neural-model/neural-model.entity';
import { NeuralModelController } from './neural-model.controller';
import { NeuralModelService } from './neural-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([NeuralModel]), CityModule],
  providers: [NeuralModelService],
  controllers: [NeuralModelController],
  exports: [NeuralModelService],
})
export class NeuralModelModule {}
