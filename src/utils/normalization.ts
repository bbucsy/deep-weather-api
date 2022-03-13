import { OpenWeatherDto } from 'src/app/open-weather/open-weather.dto';

//data got from https://hu.wikipedia.org/wiki/Magyarorsz%C3%A1g_h%C5%91m%C3%A9rs%C3%A9kleti_rekordjainak_list%C3%A1ja
const minTemp = -34.1;
const maxTemp = 41.9;

//source: https://en.wikipedia.org/wiki/Atmospheric_pressure
const minPressure = 870;
const maxPressure = 1084.8;

export const normalize = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min);
};

export const unNormalize = (
  value: number,
  min: number,
  max: number,
): number => {
  return value * (max - min) + min;
};

export const normalizeWeather = (values: OpenWeatherDto): OpenWeatherDto => {
  return {
    city: values.city,
    utc_date: values.utc_date,
    weather: values.weather,
    humidity: values.humidity / 100.0, //its a percentage
    pressure: normalize(values.pressure, minPressure, maxPressure),
    temp: normalize(values.temp, minTemp, maxTemp),
  };
};

export const unNormalizeWeather = (values: OpenWeatherDto): OpenWeatherDto => {
  return {
    city: values.city,
    utc_date: values.utc_date,
    weather: values.weather,
    humidity: values.humidity * 100.0,
    pressure: unNormalize(values.pressure, minPressure, maxPressure),
    temp: unNormalize(values.temp, minTemp, maxTemp),
  };
};
