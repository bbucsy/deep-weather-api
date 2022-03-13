import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NeuralModel } from '../neural-model/neural-model.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lon: number;

  @Column()
  lat: number;

  @OneToMany(() => NeuralModel, (neuralModel) => neuralModel.city)
  neuralModells: NeuralModel[];
}
