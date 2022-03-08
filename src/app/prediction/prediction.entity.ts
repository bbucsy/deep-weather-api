import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WeatherLabel } from '../open-weather/open-weather.dto';

@Entity()
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  //todo: openWeatherDTO

  @Column({
    type: 'enum',
    enum: WeatherLabel,
    default: WeatherLabel.Clear,
  })
  result: WeatherLabel;
}
