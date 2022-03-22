import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OWM_ENV_KEY } from 'src/utils/constants';
import { OpenWeatherHistoricalResponse } from './dto/open-weather-history.response';
import { OpenWeatherDto } from './dto/open-weather.dto';
import { OpenWeatherResponse } from './dto/open-weather.response';

@Injectable()
export class OpenWeatherService {
  constructor(private readonly config: ConfigService) {}

  private readonly logger = new Logger(OpenWeatherService.name);
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

  private historicalUrlBuilder = (lat: string, lon: string, dt: number) => {
    return `${
      this.api_base
    }/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${this.config.get(
      OWM_ENV_KEY,
    )}&units=metric`;
  };

  async getHistoricalHorlyData(
    lat: string,
    lon: string,
    windowSize: number,
    dt?: number,
  ): Promise<OpenWeatherDto[]> {
    const now = typeof dt !== 'undefined' ? dt : Math.floor(Date.now() / 1000);
    const res: OpenWeatherDto[] = [];

    let i = 0;
    while (i < 4 && res.length < windowSize) {
      const dt = now - i * 86400; // one day in seconds
      const url = this.historicalUrlBuilder(lat, lon, dt);
      this.logger.debug(url);
      const response = await axios.get<OpenWeatherHistoricalResponse>(url);
      res.push(
        ...response.data.hourly
          .map((h) => {
            const dto: OpenWeatherDto = {
              city: `${lat}, ${lon}`,
              humidity: h.humidity,
              pressure: h.pressure,
              temp: h.temp,
              utc_date: h.dt,
              weather: OpenWeatherDto.weatherCodeToLabel(h.weather[0].id),
            };
            return dto;
          })
          .slice(-windowSize),
      );
      i++;
    }
    return res.sort((a, b) => a.utc_date - b.utc_date);
  }
}
