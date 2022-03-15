import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

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
    await this.modelService.pretrainModel(model);
    this.logger.log('Model training done');
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
