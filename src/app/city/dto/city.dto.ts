import { ApiProperty } from '@nestjs/swagger';

class neuralModelBase {
  id: number;
  name: string;
}

export class CityDto {
  /**
   * ID of the city
   */
  id: number;
  /**
   * Name of the city
   */
  name: string;
  /**
   * Latitude
   */
  lat: number;
  /**
   * Longitude
   */
  lon: number;

  /**
   * Connected Neural models
   */
  @ApiProperty({ type: [neuralModelBase] })
  neuralModels: { id: number; name: string }[];
}
