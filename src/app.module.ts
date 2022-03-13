import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './app/user/user.module';
import { OpenWeatherModule } from './app/open-weather/open-weather.module';
import { ConfigModule } from '@nestjs/config';
import { PredictionModule } from './app/prediction/prediction.module';
import { CityModule } from './app/city/city.module';
import { NeuralModelModule } from './app/neural-model/neural-model.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    OpenWeatherModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PredictionModule,
    NeuralModelModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    CityModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
