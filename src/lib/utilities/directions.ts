export function degreesToRadians(degrees: number): number {
  return Math.PI / 180 * degrees;
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
