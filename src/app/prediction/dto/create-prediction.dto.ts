import { NeuralModel } from 'src/app/neural-model/neural-model.entity';
import { WeatherLabel } from 'src/app/open-weather/dto/open-weather.dto';

export interface CreatePredictionDto {
  input: number[][];
  result: WeatherLabel;
  predictionTime: Date;
  model: NeuralModel;
}
