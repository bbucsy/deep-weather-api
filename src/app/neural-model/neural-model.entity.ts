import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
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

  getPredictor = async (): Promise<Predictor> => {
    return Predictor.create(this);
  };
}
