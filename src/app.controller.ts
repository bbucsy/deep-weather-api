import { Controller, Get, Render } from '@nestjs/common';
import { OpenWeatherService } from './app/open-weather/open-weather.service';

@Controller()
export class AppController {
  constructor(private readonly weatherApi: OpenWeatherService) {}

  @Get()
  @Render('index')
  async getHello() {
    return {
      //message: await this.weatherApi.currentWeather('47.4979', '19.0402'),
      message: (
        await this.weatherApi.getHistoricalHorlyData(
          '47.4979',
          '19.0402',
          26,
          1647914400,
        )
      ).map((h) => {
        const d = new Date(h.utc_date * 1000);
        return { temp: h.temp, date: d.toLocaleString() };
      }),
    };
  }
}
