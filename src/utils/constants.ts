import { WeatherLabel } from 'src/app/open-weather/dto/open-weather.dto';

export const OWM_ENV_KEY = 'OPEN_WEATHER_API_KEY';

export const FEAUTURE_COUNT = 3;
export const LAG = 6;
export const HIDDEN_UNITS = 32;
export const LABEL_COUNT = Object.keys(WeatherLabel).length / 2;
