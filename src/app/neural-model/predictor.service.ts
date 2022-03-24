import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { OpenWeatherDto } from '../open-weather/dto/open-weather.dto';
import { PredictionService } from '../prediction/prediction.service';
import { NeuralModel } from './neural-model.entity';
import { Predictor } from './predictor';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from '../prediction/prediction.entity';
import { OpenWeatherService } from '../open-weather/open-weather.service';

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
    const predictor = await model.getPredictor();
    this.logger.debug('Got Predictor object');

    //load train data
    const trainDataPath = join(__dirname, 'training_data.json');
    const tainDataRAW = fs.readFileSync(trainDataPath, 'utf-8');
    const data = JSON.parse(tainDataRAW) as Array<OpenWeatherDto>;

    //Prepare data with windows consisting LAG+1 entires
    const prepared: OpenWeatherDto[][] = [];
    for (let i = Predictor.LAG; i < data.length; i++) {
      prepared.push(data.slice(i - Predictor.LAG, i + 1));
    }
    this.logger.debug('Pretrain data loaded');
    const info = await predictor.train(prepared);

    // set model status to "active"
    model.status = 1;
    await this.modelRepository.save(model);

    return info.history.acc as unknown as number[];
  }

  async predictWeather(model: NeuralModel): Promise<Prediction> {
    const predictor = await model.getPredictor();
    const data = await this.weatherService.getHistoricalHorlyData(
      model.city.lat.toString(),
      model.city.lon.toString(),
      Predictor.LAG,
    );

    const predictedTime = data[data.length - 1].utc_date + 3600; // add one hour

    const result = await predictor.predict(data);
    return await this.predictionService.create({
      input: data,
      model: model,
      result: result,
      predictionTime: new Date(predictedTime * 1000),
    });
  }

  async retrainModel(model: NeuralModel): Promise<number> {
    const predictor = await model.getPredictor();

    model.status = 0;
    await this.modelRepository.save(model);

    const data = await Promise.all(
      model.predictions.map(async (p) => {
        const input = JSON.parse(p.input) as OpenWeatherDto[];
        const actual = await this.predictionService.getActualWeather(p.id);
        input.push({
          city: '',
          humidity: 0,
          pressure: 0,
          temp: 0,
          utc_date: Math.floor(p.predictionTime / 1000),
          weather: actual | p.result,
        });
        return input;
      }),
    );

    const info = await predictor.trainOnce(data);

    // set model status to "active"
    model.status = 1;
    await this.modelRepository.save(model);

    return info.history.acc[0] as unknown as number;
  }
}
