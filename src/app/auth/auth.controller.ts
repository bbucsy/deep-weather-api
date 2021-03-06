import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { Role } from '../user/user-role.enum';
import { UserService } from '../user/user.service';
import {
  LoginDto,
  LoginResponseDto,
  OauthTokenDto,
  RegisterDto,
} from './dto/auth.dto';
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

  private readonly logger = new Logger(AuthController.name);

  @RequiredRole(Role.Guest)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authService.validateSimpleUserLogin(loginDto);
    if (user == null) throw new UnauthorizedException();

    return await this.authService.generateToken(user);
  }

  @Post('oauth')
  @RequiredRole(Role.Guest)
  async OauthTokenExchange(
    @Body() body: OauthTokenDto,
  ): Promise<LoginResponseDto> {
    const autoAdmin = (process.env.AUTO_ADMIN || '').split(',');
    this.logger.log(autoAdmin);

    const gh_user = await this.authService.getGithubProfile(body.token);
    let user = await this.userService.findOne(gh_user.login);

    const admin = autoAdmin.indexOf(gh_user.login) !== -1;

    if (user == null) {
      user = await this.userService.create(
        gh_user.login,
        gh_user.name,
        '*',
        true,
        admin,
      );
    }

    if (admin && user.role != Role.Admin) user.role = Role.Admin;

    return await this.authService.generateToken(user);
  }

  @RequiredRole(Role.Guest)
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userService.create(
        body.email,
        body.username,
        body.password,
      );
      return await this.authService.generateToken(user);
    } catch (error) {
      if (error?.errno == TYPOERM_ERROR_CODE.UniqueViolation)
        throw new BadRequestException(undefined, 'User already exists');

      throw new InternalServerErrorException();
    }
  }
}
