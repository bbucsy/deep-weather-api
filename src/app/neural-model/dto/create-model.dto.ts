export class CreateModelDto {
  /** Name of the neural network model */
  name: string;

  /** The number of epochs the initial training will user */
  epochs: number;

  /** The id of the city the model is attached to */
  city: number;

  /** Number of hidden layers */
  hiddenLayerCount: number;

  /** Number of LSTM units in the first layer */
  lstm_count: number;
}
