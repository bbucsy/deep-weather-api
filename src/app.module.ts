import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './app/user/user.module';
import { OpenWeatherModule } from './app/open-weather/open-weather.module';
import { ConfigModule } from '@nestjs/config';
import { PredictionModule } from './app/prediction/prediction.module';
import { CityModule } from './app/city/city.module';
import { NeuralModelModule } from './app/neural-model/neural-model.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './app/task/task.module';
import { AuthModule } from './app/auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
        connectTimeout: 5,
      },
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    UserModule,
    OpenWeatherModule,
    PredictionModule,
    NeuralModelModule,
    CityModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
