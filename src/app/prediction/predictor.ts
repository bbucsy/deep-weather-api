import * as tf from '@tensorflow/tfjs-node';
import { WeatherLabel } from '../open-weather/open-weather.dto';
import { Prediction } from './prediction.entity';

export interface NeuralModelConfiguration {
  epochs: number;
  hiddenLayerCount: number;
}

export class Predictor {
  constructor(path?: string) {
    this.modelPath = path;
  }

  private model: any;
  private modelPath: string;

  private loadModel = async () => {
    await tf.loadLayersModel(this.modelPath);
  };

  private createModel = async () => {
    const model = tf.sequential();

    //TODO create model

    this.model = model;
  };

  public predict = async (): Promise<Prediction> => {
    const result = new Prediction();
    result.result = WeatherLabel.Clear;
    return result;
  };
}
