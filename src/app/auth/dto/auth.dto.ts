export class LoginDto {
  username: string;
  password: string;
}

export class LoginResponseDto {
  access_token: string;
}

export class OauthTokenDto {
  token: string;
}
