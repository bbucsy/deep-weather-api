import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './app/user/user.module';
import { OpenWeatherModule } from './app/open-weather/open-weather.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, OpenWeatherModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
