import { Controller, Get, Render } from '@nestjs/common';
import { PredictionService } from './app/prediction/prediction.service';

@Controller()
export class AppController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get()
  @Render('index')
  async getHello() {
    return {
      //message: await this.weatherApi.currentWeather('47.4979', '19.0402'),
      message: await this.predictionService.findByCity(1),
    };
  }
}
