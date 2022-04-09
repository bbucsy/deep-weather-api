import { ApiProperty } from '@nestjs/swagger';
import { neuralModelBase } from 'src/app/neural-model/dto/neural-model.dto';

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
