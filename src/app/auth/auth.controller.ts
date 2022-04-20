import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { Role } from '../user/user-role.enum';
import { UserService } from '../user/user.service';
import { LoginDto, LoginResponseDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RequiredRole } from './role.guard';
import { TYPOERM_ERROR_CODE } from 'src/utils/constants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @RequiredRole(Role.Guest)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(loginDto);
    if (user == null) throw new UnauthorizedException();

    return await this.authService.generateToken(user);
  }

  @RequiredRole(Role.Guest)
  @Post('register')
  async register(@Body() body: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userService.create(body.username, body.password);
      return await this.authService.generateToken(user);
    } catch (error) {
      if (error?.errno == TYPOERM_ERROR_CODE.UniqueViolation)
        throw new BadRequestException(undefined, 'User already exists');

      throw new InternalServerErrorException();
    }
  }
}
