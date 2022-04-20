import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userService.findOne(loginDto.username);
    if (user && bcrypt.compareSync(loginDto.password, user.passwordHash)) {
      return user;
    } else {
      return null;
    }
  }

  async generateToken(user: User) {
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
