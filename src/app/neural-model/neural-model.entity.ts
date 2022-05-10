import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '../city/city.entity';
import { Prediction } from '../prediction/prediction.entity';
import { TFModel } from '../tensorflow/TFModel';
import { TrainingData } from './training-data.entity';

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
  // 0-> created 1-> trained 2+-> error
  @Column({ type: 'int', default: 0 })
  status: number;

  @ManyToOne(() => City, (city) => city.neuralModels)
  city: City;

  @OneToMany(() => Prediction, (prediction) => prediction.model, {
    onDelete: 'CASCADE',
  })
  predictions: Prediction[];

  @OneToMany(() => TrainingData, (data) => data.model, {
    onDelete: 'CASCADE',
  })
  trainingData: TrainingData[];

  public async loadOrCreatePredictor(): Promise<TFModel> {
    try {
      return await TFModel.loadModel(this.file_path);
    } catch (error) {
      return await TFModel.createAndSaveModel(this.file_path, {
        hiddenLayerCount: this.hiddenLayerCount,
        lstmUnits: this.lstm_count,
      });
    }
  }
}
