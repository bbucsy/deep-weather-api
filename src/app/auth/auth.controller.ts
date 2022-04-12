import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user as User);
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    await this.userService.create(body.username, body.password);
  }
}
