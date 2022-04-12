import { Module } from '@nestjs/common';
import { UserModule } from 'src/app/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [AuthService, LocalStrategy],
  imports: [UserModule],
})
export class AuthModule {}
