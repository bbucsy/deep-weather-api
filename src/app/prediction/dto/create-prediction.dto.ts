import { NeuralModel } from 'src/app/neural-model/neural-model.entity';
import {
  OpenWeatherDto,
  WeatherLabel,
} from 'src/app/open-weather/dto/open-weather.dto';

export interface CreatePredictionDto {
  input: OpenWeatherDto[];
  result: WeatherLabel;
  predictionTime: Date;
  model: NeuralModel;
}
