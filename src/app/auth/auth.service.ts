import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username, pass: string): Promise<User> {
    const user = await this.userService.findOne(username);
    if (user && bcrypt.compareSync(pass, user.passwordHash)) {
      return user;
    } else {
      return null;
    }
  }

  async login(user: User) {
    const payload = {
      username: user.name,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
