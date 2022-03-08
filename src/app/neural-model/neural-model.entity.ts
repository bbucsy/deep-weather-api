import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  getPredictor = (): Predictor => {
    return new Predictor(this.file_path);
  };
}
