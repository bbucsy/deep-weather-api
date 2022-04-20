import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.find({
      where: { name: username },
    });
    return typeof user === 'undefined' ? undefined : user[0];
  }

  async create(username: string, password: string): Promise<User> {
    const salt = bcrypt.genSaltSync();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      name: username,
      passwordHash: passwordHash,
    });
    await this.userRepository.save(user);
    return user;
  }
}
