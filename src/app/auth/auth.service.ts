import { Injectable, Logger } from '@nestjs/common';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.dto';
import {
  GHAccessTokenRequest,
  GHAccessTokenResponse,
  GithubProfile,
} from './dto/github.dto';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateSimpleUserLogin(loginDto: LoginDto): Promise<User> {
    const user = await this.userService.findOne(loginDto.email);
    if (
      user &&
      bcrypt.compareSync(loginDto.password, user.passwordHash) &&
      !user.github
    ) {
      return user;
    } else {
      return null;
    }
  }
  async getGithubProfile(code: string): Promise<GithubProfile> {
    const postBody: GHAccessTokenRequest = {
      client_id: process.env.GH_CLIENT_ID,
      client_secret: process.env.GH_CLIENT_SECRET,
      code: code,
    };

    const tokenResponse = await axios.post<
      GHAccessTokenRequest,
      AxiosResponse<GHAccessTokenResponse>
    >('https://github.com/login/oauth/access_token', postBody, {
      headers: { Accept: 'application/json' },
    });

    const accessToken = tokenResponse.data.access_token;
    this.logger.debug(accessToken);

    const userData = await axios.get<GithubProfile>(
      'https://api.github.com/user',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return userData.data;
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
