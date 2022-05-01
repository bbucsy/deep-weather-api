export class LoginDto {
  email: string;
  password: string;
}

export class RegisterDto extends LoginDto {
  username: string;
}

export class LoginResponseDto {
  access_token: string;
}

export class OauthTokenDto {
  token: string;
}
