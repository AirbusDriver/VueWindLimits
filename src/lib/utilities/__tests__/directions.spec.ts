import { degreesToRadians, normalizeBearing } from "../directions";

describe("degreesToRadians", () => {
  test.each([
    [0, 0],
    [360, Math.PI * 2],
    [-360, Math.PI * -2]
  ])("degrees: %d expected radians: %d", (inp, exp) => {
    expect(degreesToRadians(inp)).toBeCloseTo(exp, 5);
  });
});

describe("normalizeBearing", () => {
  test.each([
    [0, 360],
    [360, 360],
    [1, 1],
    [361, 1],
    [0.1, 0.1],
    [-1, 359],
    [-360, 360],
    [540, 180],
    [-90, 270],
    [-0.1, 359.9]
  ])("normalize number properly: %s => %s", (inp, exp) => {
    const result = normalizeBearing(inp);

    expect(result).toBe(exp);
  });
});