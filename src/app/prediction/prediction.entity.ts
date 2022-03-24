import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NeuralModel } from '../neural-model/neural-model.entity';
import { PredictionResponse } from './prediction-response.entity';

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

  @OneToMany(() => PredictionResponse, (response) => response.prediction)
  responses: PredictionResponse[];
}
