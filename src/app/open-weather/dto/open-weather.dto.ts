import { OpenWeatherResponse } from './open-weather.response';
import 'src/utils/range';

export enum WeatherLabel {
  Thunderstorm,
  Drizzle,
  Rain,
  Snow,
  Clear,
  Atmosphere,
  Clouds,
}
r: WeatherLabel;

export interface OpenWeatherDto {
  utc_date: number;
  city: string;
  temp: number;
  pressure: number;
  humidity: number;
  weather: WeatherLabel;
}

export const weatherCodeToLabel = (code: number): WeatherLabel => {
  if (code.range(200, 299)) return WeatherLabel.Thunderstorm;
  else if (code.range(300, 399)) return WeatherLabel.Drizzle;
  else if (code.range(500, 599)) return WeatherLabel.Rain;
  else if (code.range(600, 699)) return WeatherLabel.Snow;
  else if (code.range(700, 799)) return WeatherLabel.Atmosphere;
  else if (code.range(801, 809)) return WeatherLabel.Clouds;
  else if (code === 800) return WeatherLabel.Clear;
  else throw new Error('Unknown weather id');
};

export const OpenWeatherDtoFromResponse = (
  response: OpenWeatherResponse,
): OpenWeatherDto => {
  return {
    city: response.name,
    humidity: response.main.humidity,
    pressure: response.main.pressure,
    temp: response.main.temp,
    utc_date: response.dt,
    weather: weatherCodeToLabel(response.weather[0].id),
  };
};
