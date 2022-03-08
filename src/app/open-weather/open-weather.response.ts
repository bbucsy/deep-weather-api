export interface OpenWeatherResponse {
  id: number;
  dt: number;
  name: string;
  coord: Coord;
  main: Main;
  wind?: Wind;
  weather: Weather[];
  clouds?: Clouds;
  rain?: Rain;
  snow?: Snow;
}

export interface Clouds {
  all?: number;
}

export interface Coord {
  lat?: number;
  lon?: number;
}

export interface Main {
  temp: number;
  pressure: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
}

export interface Rain {
  '3h'?: number;
  '1h'?: number;
}

export interface Snow {
  '3h'?: number;
  '1h'?: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed?: number;
  deg?: number;
}