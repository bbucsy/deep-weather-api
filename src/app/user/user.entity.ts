import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  github: boolean;

  @Column({
    default: Role.User,
    nullable: false,
  })
  role: string;
}
