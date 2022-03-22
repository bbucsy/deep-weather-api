import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NeuralModel } from '../neural-model/neural-model.entity';

@Entity()
export class Prediction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  input: string;
  //todo: openWeatherDTO

  /*@Column({
    type: 'enum',
    enum: WeatherLabel,
    default: WeatherLabel.Clear,
  })
  result: WeatherLabel;*/
  @Column()
  result: number;

  @ManyToOne(() => NeuralModel, (model) => model.predictions)
  model: NeuralModel;
}
