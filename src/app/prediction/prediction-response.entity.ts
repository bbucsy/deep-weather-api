import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Prediction } from './prediction.entity';

@Entity()
export class PredictionResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  response: number;

  @ManyToOne(() => Prediction, (prediction) => prediction.responses)
  prediction: Prediction;
}
