export interface ResponseListDto {
  id: number;
  created_at: string;
  model: { id: number; name: string };
  prediction: number;
  userResponse: number;
}
