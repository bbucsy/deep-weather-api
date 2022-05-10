import { Injectable, Logger } from '@nestjs/common';
import { PredictionService } from '../prediction/prediction.service';
import { NeuralModel } from './neural-model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from '../prediction/prediction.entity';
import { OpenWeatherService } from '../open-weather/open-weather.service';
import {
  convertDtoToDataEntry,
  loadInitialTrainingData,
  prepareDataSet,
  preparePredictionInput,
  tensorifyPredictionInput,
  TrainingDataEntry,
} from '../tensorflow/dataConvert';
import { LAG } from 'src/utils/constants';
import { TrainingData } from './training-data.entity';

@Injectable()
export class PredictorServicve {
  constructor(
    @InjectRepository(NeuralModel)
    private readonly modelRepository: Repository<NeuralModel>,
    @InjectRepository(TrainingData)
    private readonly trainingDataRepository: Repository<TrainingData>,
    private readonly predictionService: PredictionService,
    private readonly weatherService: OpenWeatherService,
  ) {}
  private readonly logger = new Logger(PredictorServicve.name);

  async pretrainModel(model: NeuralModel): Promise<number[]> {
    this.logger.debug('Pretrain function called');
    const predictor = await model.loadOrCreatePredictor();
    this.logger.debug('Got Predictor object');

    //load train data
    const trainingData = loadInitialTrainingData().map(convertDtoToDataEntry);

    const trainingDS = prepareDataSet(trainingData);
    this.logger.debug('Pretrain data loaded');

    const info = await predictor.train(trainingDS, model.epochs);

    for (let i = 0; i < info.length; i++) {
      await this.saveTraingingData(model, i, info[i].accuracy, info[i].loss);
    }

    // set model status to "active"
    model.status = 1;
    await this.modelRepository.save(model);

    return info.map((i) => i.accuracy);
  }

  async predictWeather(model: NeuralModel): Promise<Prediction> {
    const predictor = await model.loadOrCreatePredictor();
    const dataRAW = await this.weatherService.getHistoricalHorlyData(
      model.city.lat.toString(),
      model.city.lon.toString(),
      LAG,
    );
    const data = preparePredictionInput(dataRAW);

    const predictedTime = dataRAW[dataRAW.length - 1].utc_date + 3600; // add one hour

    const result = predictor.predict(tensorifyPredictionInput(data));

    return await this.predictionService.create({
      input: data,
      model: model,
      result: result.prediction,
      predictionTime: new Date(predictedTime * 1000),
    });
  }

  async retrainModel(model: NeuralModel): Promise<number> {
    const predictor = await model.loadOrCreatePredictor();

    const predictions =
      await this.predictionService.getPredictionsWithResponses(model.id, true);

    const data: TrainingDataEntry[] = predictions
      .map((p) => {
        if (typeof p.input === undefined) return null;
        const input = JSON.parse(p.input) as number[][];
        return {
          x: input,
          y: p.user_response,
        };
      })
      .filter((tde) => tde != null);

    if (!data || data.length == 0) return 0;

    model.status = 0;
    await this.modelRepository.save(model);

    this.logger.debug(`Training entry number: ${data.length}`);
    const info = await predictor.train(prepareDataSet(data), 1);

    const setUsedPromise = this.predictionService.setUsedBulk(
      predictions.map((p) => p.prediction_id),
      true,
    );

    const saveDataPromise = this.saveTraingingData(
      model,
      1,
      info[0].accuracy,
      info[0].loss,
    );

    await Promise.all([setUsedPromise, saveDataPromise]);

    // set model status to "active"
    model.status = 1;
    await this.modelRepository.save(model);

    return info[0].accuracy;
  }

  private async saveTraingingData(
    model: NeuralModel,
    epoch: number,
    accuracy: number,
    loss: number,
  ) {
    const data = this.trainingDataRepository.create({
      accuracy: accuracy,
      epoch: epoch,
      loss: loss,
      model: model,
    });
    await this.trainingDataRepository.save(data);
  }
}
