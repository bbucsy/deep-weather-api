import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';

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
}
