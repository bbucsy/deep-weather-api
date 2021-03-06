import { WeatherLabel } from 'src/app/open-weather/dto/open-weather.dto';

export const OWM_ENV_KEY = 'OPEN_WEATHER_API_KEY';

export const FEAUTURE_COUNT = 4;
export const LAG = 6;
export const HIDDEN_UNITS = 32;
export const LABEL_COUNT = Object.keys(WeatherLabel).length / 2;

export enum TYPOERM_ERROR_CODE {
  UniqueViolation = 19,
}
