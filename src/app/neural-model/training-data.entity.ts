import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NeuralModel } from './neural-model.entity';

@Entity()
export class TrainingData {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created: Date;

  @Column('int')
  epoch: number;

  @Column('double')
  accuracy: number;

  @Column('double')
  loss: number;

  @ManyToOne(() => NeuralModel, (model) => model.trainingData)
  model: NeuralModel;
}
