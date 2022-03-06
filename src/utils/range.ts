declare global {
  interface Number {
    range(min: number, max: number): boolean;
  }
}

Number.prototype.range = function (min: number, max: number): boolean {
  const x = Number(this);
  return min <= x && x <= max;
};

export {};
