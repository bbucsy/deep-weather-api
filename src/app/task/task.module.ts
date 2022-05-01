import { Module } from '@nestjs/common';
import { NeuralModelModule } from '../neural-model/neural-model.module';
import { PredictionModule } from '../prediction/prediction.module';
import { TaskService } from './task.service';

@Module({
  imports: [NeuralModelModule, PredictionModule],
  providers: [TaskService],
})
export class TaskModule {}
