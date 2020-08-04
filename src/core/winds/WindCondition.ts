import { normalizeBearing } from "../utilities/directions"

export default class WindCondition {
  protected _direction: number;
  protected _speed: number;

  constructor(direction: number, speed: number) {
    this._direction = normalizeBearing(direction);
    this._speed = speed;
  }

  public toString() {
    const dirString = `${this.direction}`.padStart(3, "0");
    return `Winds: ${dirString}\u00B0 @ ${this.speed}`;
  }

  public get direction(): number {
    return this._direction;
  }

  public set direction(val: number) {
    if (isNaN(val)) {
      throw new TypeError("direction must be a number");
    }
    this._direction = normalizeBearing(val);
  }

  public get speed(): number {
    return this._speed;
  }

  public set speed(val: number) {
    if (isNaN(val) || val < 0) {
      throw new RangeError("speed must be a number >= 0");
    }
    this._speed = val;
  }
}