export class Predictor {
  predictNext(values: number[]) {
    if (values.length < 3) return values[values.length - 1];
    const last = values.slice(-3);
    const slope = last[2] - last[1];
    return last[2] + slope;
  }
}
