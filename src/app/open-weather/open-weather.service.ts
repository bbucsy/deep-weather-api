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

  /**
   * Returns the current *non normalized* weather data of given location
   * @param lat latitude
   * @param lon longitude
   * @returns Simplified DTO of current weather data
   */
  async currentWeather(lat: string, lon: string): Promise<OpenWeatherDto> {
    const url = `${
      this.api_base
    }/weather?lat=${lat}&lon=${lon}&appid=${this.config.get(
      OWM_ENV_KEY,
    )}&units=metric`;

    const response = await axios.get<OpenWeatherResponse>(url);

    return OpenWeatherDto.fromOpenWeatherResponse(response.data);
  }
}
