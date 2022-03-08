import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  //todo: openWeatherDTO

  /*@Column({
    type: 'enum',
    enum: WeatherLabel,
    default: WeatherLabel.Clear,
  })
  result: WeatherLabel;*/
  @Column()
  result: number;
}
