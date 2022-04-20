import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Role } from '../user/user-role.enum';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto, LoginResponseDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.guard';
import { RequiredRole } from './role.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @RequiredRole(Role.Guest)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.authService.login(req.user as User);
  }

  @RequiredRole(Role.Guest)
  @Post('register')
  async register(@Body() body: LoginDto) {
    await this.userService.create(body.username, body.password);
  }
}
