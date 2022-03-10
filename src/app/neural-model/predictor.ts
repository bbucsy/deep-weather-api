import * as tf from '@tensorflow/tfjs-node';
import { OpenWeatherDto, WeatherLabel } from '../open-weather/open-weather.dto';
import { Prediction } from '../prediction/prediction.entity';
import { NeuralModel } from './neural-model.entity';

export interface NeuralModelConfiguration {
  epochs: number;
  hiddenLayerCount: number;
  lstm_units: number;
}

export class Predictor {
  private constructor(path?: string) {
    this.modelPath = path;
  }

  public static async create(neuralModel: NeuralModel): Promise<Predictor> {
    const object = new Predictor(neuralModel.file_path);
    try {
      object.loadModel();
    } catch (error) {
      object.createModel({
        epochs: neuralModel.epochs,
        hiddenLayerCount: neuralModel.hiddenLayerCount,
        lstm_units: neuralModel.lstm_count,
      });
    }
    return object;
  }

  private static readonly FEAUTURE_COUNT = 3;
  private static readonly LAG = 6;
  private static readonly HIDDEN_UNITS = 32;

  private model: tf.Sequential;
  private modelPath: string;

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
        units: Object.keys(WeatherLabel).length / 2,
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

  public predict = async (input: OpenWeatherDto[]): Promise<Prediction> => {
    if (input.length !== Predictor.LAG)
      throw new Error('Wrong number of inputs for neural network');

    const inputs_raw = input.map((data) => {
      //TODO normailize data
      return [data.humidity, data.pressure, data.temp];
    });

    const input_tensor = tf.tensor(inputs_raw);

    const result_tensor = this.model.predict(input_tensor) as tf.Tensor;
    const labelIndex = tf.argMax(result_tensor).dataSync()[0];

    const result = new Prediction();
    result.result = labelIndex;
    return result;
  };
}
