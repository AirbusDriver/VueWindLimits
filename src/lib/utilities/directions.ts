import { readConfigFile } from 'typescript';

export function degreesToRadians(degrees: number): number {
  return (Math.PI / 180) * degrees;
}


export function radiansToDegrees(radians: number, precision: number = 2): number {
  if (radians === 0) return 0;
  const multiplier = 10 ** precision;
  return Math.round(((180 / Math.PI) * radians) * multiplier) / multiplier;
}

export function normalizeBearing(val: number | string, force360: boolean = true): number {
  const numVal = +val;
  if (isNaN(numVal)) {
    throw new TypeError(`val must be a number, got: ${typeof val}`);
  }
  const modVal = numVal % 360;

  if (modVal === 0 && force360)
    return 360;
  if (modVal < 0)
    return 360 + modVal;
  return modVal;
}
