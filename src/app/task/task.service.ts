import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NeuralModelService } from '../neural-model/neural-model.service';

@Injectable()
export class TaskService {
  constructor(private readonly modelService: NeuralModelService) {}

  private readonly logger = new Logger(TaskService.name);

  @Cron('0 1 * * * *')
  handlePrediction() {
    this.modelService.startWeatherPredictionJob();
  }

  @Cron(CronExpression.EVERY_WEEK)
  handleRetrain() {
    this.modelService.startRetrainJobs();
  }
}
