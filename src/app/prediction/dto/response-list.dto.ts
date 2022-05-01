export class ResponseListDto {
  /**Id of response */
  id: number;
  /**Date of response creation in ISO string format */
  created_at: string;

  /** The model that created the prediction */
  model: { id: number; name: string };

  /** The weather label the neural model predicted */
  prediction: number;

  /** The response the user submitted */
  userResponse: number;
}

export interface PredictionWithResponse {
  input?: string;
  prediction_id: number;
  user_response: number;
  prediction_result: number;
}
