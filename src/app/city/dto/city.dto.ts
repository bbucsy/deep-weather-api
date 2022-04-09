export interface CityDto {
  id: number;
  name: string;
  lat: number;
  lon: number;
  neuralModels: { id: number; name: string }[];
}
