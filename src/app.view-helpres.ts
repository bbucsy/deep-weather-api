export const helpers = {
  renderStatusBar: (code: number) => {
    switch (code) {
      case 0:
        return '<span class="badge bg-warning text-dark">Training <span class="spinner-border spinner-border-sm"></span></span>';
      case 1:
        return '<span class="badge bg-success">Trained <i class="bi bi-check2-circle"></i> </span>';
      default:
        return '<span class="badge bg-danger">Error during training <i class="bi bi-info-circle-fill"></i> </span>';
    }
  },

  renderCoordinates: (lat: string | number, lon: string | number): string => {
    const longitude = typeof lon == 'string' ? Number.parseInt(lon) : lon;
    const latitude = typeof lat == 'string' ? Number.parseInt(lat) : lat;

    const lat_label = lat > 0 ? 'N' : 'S';
    const lon_label = lon > 0 ? 'E' : 'W';

    return `${latitude.toFixed(4)}° ${lat_label}, ${longitude.toFixed(
      4,
    )}° ${lon_label}`;
  },

  renderWeatherLabel: (code: number): string => {
    switch (code) {
      case 0:
        return 'Thunderstorm';
      case 1:
        return 'Drizzle';
      case 2:
        return 'Rain';
      case 4:
        return 'Snow';
      case 5:
        return 'Clear';
      case 6:
        return 'Atmospheric phenomenon ';
      default:
        return 'Cloudy';
    }
  },

  renderHourWindow: (dt: number, windowSize: number) => {
    const date = new Date(dt);
    date.setMinutes(0, 0, 0);
    const date2 = new Date(date.getTime());
    date2.setHours(date2.getHours() + windowSize);

    if (date.getTime() < date2.getTime()) {
      return `${date.toLocaleTimeString()} - ${date2.toLocaleTimeString()}`;
    } else {
      return `${date2.toLocaleTimeString()} - ${date.toLocaleTimeString()}`;
    }
  },
};
