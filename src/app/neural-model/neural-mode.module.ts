import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeuralModel } from '../neural-model/neural-model.entity';
import { NeuralModelService } from './neural-model.service';

@Module({
  imports: [TypeOrmModule.forFeature([NeuralModel])],
  providers: [NeuralModelService],
  exports: [NeuralModelService],
})
export class NeuralModelModule {}
