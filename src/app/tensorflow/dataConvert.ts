import { join } from 'path';
import * as fs from 'fs';
import * as tf from '@tensorflow/tfjs-node';
import { OpenWeatherDto } from '../open-weather/dto/open-weather.dto';
import { LABEL_COUNT, LAG } from 'src/utils/constants';
import { normalizeWeather } from 'src/utils/normalization';

export interface TrainingDataEntry {
  x: number[][];
  y: number;
}

export const loadInitialTrainingData = (): OpenWeatherDto[][] => {
  const trainDataPath = join(__dirname, 'training_data.json');
  const tainDataRAW = fs.readFileSync(trainDataPath, 'utf-8');
  const data = JSON.parse(tainDataRAW) as Array<OpenWeatherDto>;

  const prepared: OpenWeatherDto[][] = [];
  for (let i = LAG; i < data.length; i++) {
    prepared.push(data.slice(i - LAG, i + 1));
  }
  return prepared;
};

export const numifyData = (data: OpenWeatherDto): number[] => {
  const n = normalizeWeather(data);
  return [n.humidity, n.pressure, n.temp, n.weather];
};

export const convertDtoToDataEntry = (
  dto: OpenWeatherDto[],
): TrainingDataEntry => {
  if (dto.length !== LAG + 1) throw 'Unexpected array lenght at data process';

  const x = dto.slice(0, LAG).map(numifyData);
  const y = dto[LAG].weather;
  return { x, y };
};

export const prepareDataSet = (
  data: TrainingDataEntry[],
): tf.data.Dataset<tf.TensorContainer> => {
  const xs = tf.data.array(data.map((d) => tf.tensor(d.x)));
  const ys = tf.data.array(data.map((d) => tf.oneHot(d.y, LABEL_COUNT)));
  return tf.data.zip({ xs, ys });
};

export const preparePredictionInput = (dto: OpenWeatherDto[]): number[][] => {
  if (dto.length !== LAG) throw 'Unexpected array lenght at data process';
  return dto.map(numifyData);
};

export const tensorifyPredictionInput = (input: number[][]): tf.Tensor => {
  return tf.tensor([input]);
};
