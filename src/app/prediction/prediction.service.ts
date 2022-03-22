import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NeuralModelService } from '../neural-model/neural-model.service';
import { Predictor } from '../neural-model/predictor';
import { OpenWeatherService } from '../open-weather/open-weather.service';
import { Prediction } from './prediction.entity';

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(Prediction)
    private readonly predictionRepository: Repository<Prediction>,
    private readonly modelService: NeuralModelService,
    private readonly weatherService: OpenWeatherService,
  ) {}

  async predictWeather(model_id: number): Promise<Prediction> {
    const model = await this.modelService.findOne(model_id, true);
    const predictor = await model.getPredictor();
    const data = await this.weatherService.getHistoricalHorlyData(
      model.city.lat.toString(),
      model.city.lon.toString(),
      Predictor.LAG,
    );
    const result = await predictor.predict(data);
    const prediction = this.predictionRepository.create({
      input: JSON.stringify(data),
      model: model,
      result: result,
    });
    this.predictionRepository.save(prediction);
    return prediction;
  }

  async findAllPredictions(): Promise<Prediction[]> {
    return this.predictionRepository.find();
  }

  async findByCity(city_id: number): Promise<Prediction[]> {
    return this.predictionRepository.find({
      where: { model: { city: city_id } },
    });
  }
}
