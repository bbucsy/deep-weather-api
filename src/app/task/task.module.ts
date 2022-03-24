import { Module } from '@nestjs/common';
import { NeuralModelModule } from '../neural-model/neural-model.module';
import { TaskService } from './task.service';

@Module({
  imports: [NeuralModelModule],
  providers: [TaskService],
})
export class TaskModule {}
