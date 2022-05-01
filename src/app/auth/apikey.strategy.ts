import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  private readonly logger = new Logger(ApiKeyStrategy.name);

  constructor() {
    super({ header: `x-api-key`, prefix: `` }, true, (apikey: string, done) => {
      const success = (process.env.API_KEYS || '').split(',').includes(apikey);
      this.logger.debug(
        `x-api-key: ${apikey} -- ${success ? 'allowed' : 'denied'}`,
      );
      if (success) return done(null, true);
      else return done(new UnauthorizedException());
    });
  }
}

export class ApiKeyAuthGuard extends AuthGuard('headerapikey') {
  handleRequest(err: any, user: any) {
    if (err) throw err;
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
