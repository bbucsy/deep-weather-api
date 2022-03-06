import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OWM_ENV_KEY } from 'src/utils/constants';
import { OpenWeatherDto } from './open-weather.dto';
import { OpenWeatherResponse } from './open-weather.response';

@Injectable()
export class OpenWeatherService {
  constructor(private readonly config: ConfigService) {}

  private api_base = 'http://api.openweathermap.org/data/2.5';

  async currentWeather(lat: string, lon: string): Promise<OpenWeatherDto> {
    const url = `${
      this.api_base
    }/weather?lat=${lat}&lon=${lon}&appid=${this.config.get(
      OWM_ENV_KEY,
    )}&units=metric`;

    console.log(url);

    const response = await axios.get<OpenWeatherResponse>(url);

    console.log(response.data);
    return OpenWeatherDto.fromOpenWeatherResponse(response.data);
  }
}
