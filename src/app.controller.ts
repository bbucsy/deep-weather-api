import { Controller, Get, Render } from '@nestjs/common';
import { OpenWeatherService } from './app/open-weather/open-weather.service';

@Controller()
export class AppController {
  constructor(private readonly weatherApi: OpenWeatherService) {}

  @Get()
  @Render('index')
  async getHello() {
    return { message: await this.weatherApi.currentWeather('35', '139') };
  }
}
