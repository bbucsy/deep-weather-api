import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username, pass: string): Promise<User> {
    const user = await this.userService.findOne(username);
    if (user && bcrypt.compareSync(pass, user.passwordHash)) {
      return user;
    } else {
      return null;
    }
  }
}
