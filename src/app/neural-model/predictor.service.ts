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
} from '../tensorflow/dataConvert';
import { LAG } from 'src/utils/constants';

@Injectable()
export class PredictorServicve {
  constructor(
    @InjectRepository(NeuralModel)
    private readonly modelRepository: Repository<NeuralModel>,
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

    // set model status to "active"
    model.status = 1;
    await this.modelRepository.save(model);

    return info;
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
}
