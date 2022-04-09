export interface PredictionListDto {
  id: number;
  predictionTime: number;
  predictedLabel: number;
  userResponseLabel: number;
  model: {
    id: number;
    name: string;
  };
}
