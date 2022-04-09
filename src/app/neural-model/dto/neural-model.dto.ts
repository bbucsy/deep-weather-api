export interface NeuralModelDto {
  id: number;

  name: string;

  epochs: number;

  hiddenLayerCount: number;

  lstm_count: number;

  accuracy: number;

  status: number;

  city: { id: number; name: string };
}

export interface NeuralModelListDto {
  id: number;

  name: string;

  status: number;
}
