export interface IModelConfig {
  hiddenLayerCount: number;
  lstmUnits: number;
}

export interface PredictionResult {
  prediction: number;
  confidence: number;
}

export abstract class Predictor {
  abstract train(
    trainData: any,
    epochs: number,
  ): Promise<{ accuracy: number; loss: number }[]>;

  abstract predict(input: any): PredictionResult;
}
