export function paddedDirection(val: string | number): string {
  return `${val}`.padStart(3, '0') + '\u00B0';
}