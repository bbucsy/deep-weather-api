import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '../city/city.entity';
import { Predictor } from './predictor';

@Entity()
export class NeuralModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  file_path: string;

  @Column('int')
  epochs: number;

  @Column('int')
  hiddenLayerCount: number;

  @Column('int')
  lstm_count: number;

  @Column({ type: 'boolean', default: false })
  ready: boolean;

  @ManyToOne(() => City, (city) => city.neuralModells)
  city: City;

  getPredictor = async (): Promise<Predictor> => {
    return Predictor.create(this);
  };
}
