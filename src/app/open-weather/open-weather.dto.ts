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

function weatherCodeToLabel(code: number): WeatherLabel {
  if (code.range(200, 299)) return WeatherLabel.Thunderstorm;
  else if (code.range(300, 399)) return WeatherLabel.Drizzle;
  else if (code.range(500, 599)) return WeatherLabel.Rain;
  else if (code.range(600, 699)) return WeatherLabel.Snow;
  else if (code.range(700, 799)) return WeatherLabel.Atmosphere;
  else if (code.range(801, 809)) return WeatherLabel.Clouds;
  else if (code === 800) return WeatherLabel.Clear;
  else throw new Error('Unknown weather id');
}

export class OpenWeatherDto {
  utc_date: number;
  city: string;
  temp: number;
  pressure: number;
  humidity: number;
  weather: WeatherLabel;

  static fromOpenWeatherResponse(
    response: OpenWeatherResponse,
  ): OpenWeatherDto {
    const object = new OpenWeatherDto();
    // contruct simplified dto from complex api response

    object.utc_date = response.dt;
    object.city = response.name;
    object.humidity = response.main.humidity;
    object.pressure = response.main.pressure;
    object.temp = response.main.temp;
    object.weather = weatherCodeToLabel(response.weather[0].id);

    return object;
  }
}
