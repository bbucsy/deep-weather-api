import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NeuralModelService } from '../neural-model/neural-model.service';
import { PredictionService } from '../prediction/prediction.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly modelService: NeuralModelService,
    private readonly predcitionService: PredictionService,
  ) {}

  private readonly logger = new Logger(TaskService.name);

  @Cron('0 1 * * * *')
  handlePrediction() {
    this.modelService.startWeatherPredictionJob();
  }

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  handleRetrain() {
    this.modelService.startRetrainJobs();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleAutoRespond() {
    this.predcitionService.startAutoRespondJob();
  }
}
