import { degreesToRadians, normalizeBearing } from './utilities/directions';

interface WindVectorCalculation {
  (angle: number, velocity: number): number;
  (referenceBearing: number, windDirection: number, velocity: number): number;
}


/**
 * Return a number representing a crosswind value. A negative number represents
 * a crosswind from the left. 
 */
const calculateCrosswind: WindVectorCalculation = (a: number, b: number, c?: number): number => {

  let reference;
  let windDir;
  let velocity;

  if (c === undefined) {

    reference = 0;
    windDir = normalizeBearing(a);
    velocity = b;

  } else {
    let normalizedReference = normalizeBearing(a);
    let fromNorth = 360 - normalizedReference;

    reference = 0;
    windDir = normalizeBearing(b + fromNorth);
    velocity = c;
  }

  let delta = normalizeBearing(windDir - reference);
  let rad = degreesToRadians(delta);
  let parsedVelocity = +velocity;
  return Math.sin(rad) * parsedVelocity;
}

/**
 * Return a number representing a headwind component. A negative number represents
 * a tailwind value.
 */
const calculateHeadwind: WindVectorCalculation = (a: number, b: number, c?: number): number => {
  if (c === undefined) {
    return calculateCrosswind(
      a + 90,
      b
    );
  } else {
    return calculateCrosswind(
      a - 90,
      b,
      c
    );
  }
}


export {
  calculateCrosswind,
  calculateHeadwind
}