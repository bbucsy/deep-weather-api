import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './app/user/user.module';
import { OpenWeatherModule } from './app/open-weather/open-weather.module';
import { ConfigModule } from '@nestjs/config';
import { PredictionModule } from './app/prediction/prediction.module';
import { CityModule } from './city/city.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    OpenWeatherModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PredictionModule,
    CityModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
