import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Prediction } from '../prediction/prediction.entity';

import { NeuralModelService } from './neural-model.service';

@Processor('neural-model')
export class NeuralModelProcessor {
  private readonly logger = new Logger(NeuralModelProcessor.name);

  constructor(private readonly modelService: NeuralModelService) {}

  @Process('pretrain')
  async handlePretrain(job: Job) {
    this.logger.log('Start pretraining model');
    this.logger.debug(`modelId: ${job.data.modelId}`);
    const modelId = job.data.modelId as number;
    const model = await this.modelService.findOne(modelId);
    const info = await this.modelService.pretrainModel(model);
    this.modelService.setAccuracy(modelId, info[info.length - 1]);
    this.logger.log('Model training done');
  }

  @Process('predict')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handlePredict(_job: Job) {
    this.logger.log('Start predicting weather');
    const models = this.modelService.findByStatus(1);
    const predictionFunctions: Promise<Prediction>[] = (await models).map(
      (model) => {
        return this.modelService.makePrediction(model);
      },
    );
    await Promise.all(predictionFunctions);
    this.logger.log('Prediction cycle ended');
  }

  @OnQueueFailed()
  async handler(job: Job, err: Error) {
    this.logger.error('job failed');
    this.logger.error(err.stack);
    this.logger.log('Setting model status to error state');
    try {
      this.modelService.setErrorState(job.data.modelId as number);
    } catch (error) {
      this.logger.error('Could not set model status to error state.');
      this.logger.error(error);
    }
  }
}
