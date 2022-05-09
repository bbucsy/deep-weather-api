export class NeuralModelDto {
  id: number;

  name: string;

  epochs: number;

  hiddenLayerCount: number;

  lstm_count: number;

  accuracy?: number;

  status: number;

  city: { id: number; name: string };
}

export class NeuralModelListDto {
  id: number;

  name: string;

  status: number;
}

export class neuralModelBase {
  id: number;
  name: string;
}

export class NeuralModelAccuracyDto {
  accuracy?: number;
}
