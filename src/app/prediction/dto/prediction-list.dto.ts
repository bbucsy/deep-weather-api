export class PredictionListDto {
  /** Id of the prediction */
  id: number;

  /** The end of the time window the prediction is meant for */
  predictionTime: number;
  /** The weather label code, the neural network predicted */
  predictedLabel: number;
  /** The most voted weather labels by the users */
  userResponseLabel: number;

  /** The model giving the prediction */
  model: {
    /** Id of the model */
    id: number;
    /** Name of the model */
    name: string;
  };

  /** The city the prediction is given for*/
  city: {
    /**Id of the city */
    id: number;

    /**Name of the city */
    name: string;
  };
}
