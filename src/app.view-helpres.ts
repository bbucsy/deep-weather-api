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
};
