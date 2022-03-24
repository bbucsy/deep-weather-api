import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '../city/city.entity';
import { Prediction } from '../prediction/prediction.entity';
import { Predictor } from './predictor';

@Entity()
export class NeuralModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  file_path: string;

  @Column()
  name: string;

  @Column('int')
  epochs: number;

  @Column('int')
  hiddenLayerCount: number;

  @Column('int')
  lstm_count: number;

  @Column({ type: 'float', default: 0.0 })
  accuracy: number;

  // 0-> created 1-> trained 2+-> error
  @Column({ type: 'int', default: 0 })
  status: number;

  @ManyToOne(() => City, (city) => city.neuralModells)
  city: City;

  @OneToMany(() => Prediction, (prediction) => prediction.model)
  predictions: Prediction[];

  private predictor_instance?: Predictor = null;

  getPredictor = async (): Promise<Predictor> => {
    if (this.predictor_instance == null) {
      this.predictor_instance = await Predictor.create(this);
    }
    return this.predictor_instance;
  };
}
