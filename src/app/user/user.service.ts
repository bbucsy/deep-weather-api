import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from './user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.find({
      where: { email: email },
    });
    return typeof user === 'undefined' ? undefined : user[0];
  }

  async create(
    email: string,
    username: string,
    password: string,
    github = false,
    admin = false,
  ): Promise<User> {
    const salt = bcrypt.genSaltSync();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      email: email,
      name: username,
      github: github,
      passwordHash: passwordHash,
      role: admin ? Role.Admin : Role.User,
    });
    await this.userRepository.save(user);
    return user;
  }
}
