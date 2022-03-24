import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Prediction } from '../prediction/prediction.entity';
import { NeuralModelService } from './neural-model.service';
import { PredictorServicve } from './predictor.service';

@Processor('neural-model')
export class NeuralModelProcessor {
  private readonly logger = new Logger(NeuralModelProcessor.name);

  constructor(
    private readonly predictorService: PredictorServicve,
    private readonly modelService: NeuralModelService,
  ) {}

  @Process('pretrain')
  async handlePretrain(job: Job) {
    this.logger.log('Start pretraining model');
    this.logger.debug(`modelId: ${job.data.modelId}`);
    const modelId = job.data.modelId as number;

    // Get model from service
    const model = await this.modelService.findOne(modelId);

    // Start pretraining the model
    const info = await this.predictorService.pretrainModel(model);

    // Set accuracy from training result
    this.modelService.setAccuracy(modelId, info[info.length - 1]);
    this.logger.log('Model training done');
  }

  @Process('predict')
  async handlePredict(job: Job) {
    this.logger.log(`Job(${job.id}) Start predicting weather`);
    try {
      // find all active models
      const models = await this.modelService.findByStatus(1);

      // get an array of Promises to run all of them
      const predictionFunctions: Promise<Prediction>[] = models.map((model) => {
        return this.predictorService.predictWeather(model);
      });
      await Promise.all(predictionFunctions);
    } catch (error) {
      this.logger.error('error occured during prediction cycle');
      this.logger.error(error);
    }

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
