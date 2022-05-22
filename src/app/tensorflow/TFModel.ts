import * as tf from '@tensorflow/tfjs-node';
import {
  FEAUTURE_COUNT,
  HIDDEN_UNITS,
  LABEL_COUNT,
  LAG,
} from 'src/utils/constants';
import { max } from 'src/utils/normalization';
import { IModelConfig, Predictor } from '../neural-model/predictor.interface';

export class TFModel extends Predictor {
  private model: tf.LayersModel;

  private constructor(model: tf.LayersModel) {
    super();
    this.model = model;
  }

  private static createModel(config: IModelConfig): tf.Sequential {
    const model = tf.sequential();
    model.add(
      tf.layers.lstm({
        inputShape: [LAG, FEAUTURE_COUNT],
        units: config.lstmUnits,
      }),
    );

    const hiddenCount = Math.max(1, config.hiddenLayerCount);
    for (let i = 0; i < hiddenCount; i++) {
      model.add(tf.layers.dense({ units: HIDDEN_UNITS, activation: 'relu' }));
    }

    model.add(tf.layers.dense({ units: LABEL_COUNT, activation: 'softmax' }));

    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['accuracy'],
    });
    model.summary();
    return model;
  }

  public static async loadModel(path: string): Promise<TFModel> {
    const model = await tf.loadLayersModel(path);
    return new TFModel(model);
  }

  public static async createAndSaveModel(
    path: string,
    config: IModelConfig,
  ): Promise<TFModel> {
    const model = TFModel.createModel(config);
    await model.save(path);
    return new TFModel(model);
  }

  // model functions

  public async train(
    trainData: tf.data.Dataset<tf.TensorContainer>,
    epochs: number,
  ): Promise<{ accuracy: number; loss: number }[]> {
    const ds = trainData.shuffle(100).batch(32);
    const info = await this.model.fitDataset(ds, {
      epochs: epochs,
    });

    return info.history.acc.map((acc, index) => {
      return {
        accuracy: acc as number,
        loss: info.history.loss[index] as number,
      };
    });
  }

  public predict(input: tf.Tensor): { prediction: number; confidence: number } {
    const resultTensor = this.model.predict(input) as tf.Tensor;
    const resArray = Array.from(resultTensor.dataSync());
    const prediction = max(resArray);
    return { prediction: prediction.idx, confidence: prediction.value };
  }
}
