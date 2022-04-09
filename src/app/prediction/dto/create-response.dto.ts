export class CreateResponseDto {
  /** The id of the prediction the response is submitted for */
  prediction_id: number;
  /** The weather label the user wants to submit to the prediction */
  response: number;
}
