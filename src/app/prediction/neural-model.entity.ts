import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface NeuralModelConfiguration {
  epochs: number;
  hiddenLayerCount: number;
}

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
}
