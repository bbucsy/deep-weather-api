export const helpers = {
  renderStatusBar: (code: number) => {
    switch (code) {
      case 0:
        return '<span class="badge bg-warning text-dark">Training <span class="spinner-border spinner-border-sm"></span></span>';
      case 1:
        return '<span class="badge bg-success">Trained</span>';
      default:
        return '<span class="badge bg-danger">Error during training</span>';
    }
  },
};
