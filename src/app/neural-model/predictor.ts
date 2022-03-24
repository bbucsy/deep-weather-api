import * as tf from '@tensorflow/tfjs-node';
import { normalizeWeather } from 'src/utils/normalization';
import {
  OpenWeatherDto,
  WeatherLabel,
} from '../open-weather/dto/open-weather.dto';

import { NeuralModel } from './neural-model.entity';

export interface NeuralModelConfiguration {
  epochs: number;
  hiddenLayerCount: number;
  lstm_units: number;
}

export class Predictor {
  private constructor(config: NeuralModelConfiguration, path?: string) {
    this.modelPath = path;
    this.config = config;
  }

  public static async create(neuralModel: NeuralModel): Promise<Predictor> {
    const config = {
      epochs: neuralModel.epochs,
      hiddenLayerCount: neuralModel.hiddenLayerCount,
      lstm_units: neuralModel.lstm_count,
    };
    const object = new Predictor(config, neuralModel.file_path);
    try {
      await object.loadModel();
    } catch (error) {
      await object.createModel(config);
    }
    return object;
  }

  static readonly FEAUTURE_COUNT = 3;
  static readonly LAG = 6;
  private static readonly HIDDEN_UNITS = 32;
  static readonly LABEL_COUNT = Object.keys(WeatherLabel).length / 2;

  private model: tf.Sequential;
  private modelPath: string;
  private config: NeuralModelConfiguration;

  private loadModel = async () => {
    await tf.loadLayersModel(this.modelPath);
  };

  private createModel = async (config: NeuralModelConfiguration) => {
    this.model = tf.sequential();
    this.model.add(
      tf.layers.lstm({
        units: config.lstm_units,
        inputShape: [Predictor.LAG, Predictor.FEAUTURE_COUNT],
      }),
    );
    const hiddenCount = Math.max(1, config.hiddenLayerCount);
    for (let i = 0; i < hiddenCount; i++) {
      this.model.add(
        tf.layers.dense({ units: Predictor.HIDDEN_UNITS, activation: 'relu' }),
      );
    }
    this.model.add(
      tf.layers.dense({
        units: Predictor.LABEL_COUNT,
        activation: 'softmax',
      }),
    );

    await this.model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['accuracy'],
    });

    await this.model.save(this.modelPath);
  };

  private convertDtoToNumberArray = (input: OpenWeatherDto[]): number[][] => {
    if (input.length !== Predictor.LAG)
      throw new Error('Wrong number of inputs for neural network');

    return input
      .map(normalizeWeather)
      .map((dto) => [dto.humidity, dto.pressure, dto.temp]);
  };

  public predict = async (input: OpenWeatherDto[]): Promise<number> => {
    const input_tensor = tf.tensor([this.convertDtoToNumberArray(input)]);
    const result_tensor = this.model.predict(input_tensor) as tf.Tensor;
    const labelIndex = tf.argMax(result_tensor).dataSync()[0];
    return labelIndex;
  };

  public train = async (trainData: OpenWeatherDto[][]): Promise<tf.History> => {
    const xs = tf.tensor(
      trainData
        .map((td) => td.slice(0, Predictor.LAG))
        .map(this.convertDtoToNumberArray),
    );

    const ys = tf.tensor(
      trainData.map((td) =>
        tf.oneHot(td[Predictor.LAG].weather, Predictor.LABEL_COUNT).dataSync(),
      ),
    );

    const info = await this.model.fit(xs, ys, {
      epochs: this.config.epochs,
      validationSplit: 0.3,
      shuffle: true,
      batchSize: 32,
      verbose: 0,
    });

    this.model.save(this.modelPath);

    return info;
  };

  public summary = (override = true): string => {
    if (!override) {
      this.model.summary();
      return '';
    }
    const lines: string[] = [];
    this.model.summary(undefined, undefined, (message) => {
      lines.push(message);
    });
    return lines.join('\n');
  };
}
