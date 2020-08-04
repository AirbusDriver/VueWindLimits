import "jest";
import { calculateCrosswind, calculateHeadwind } from "../windCalculations";

describe("calculateCrosswind calculates correctly", () => {
  test.each([
    [0, 0],
    [30, 5],
    [-30, -5],
    [90, 10],
    [-90, -10],
    [180, 0],
    [-180, 0],
    [540, 0]
  ])("from angle: %d", (angle, exp) => {
    const result = calculateCrosswind(angle, 10);

    expect(result).toBeCloseTo(exp, 5);
  });

  test.each([
    [90, 0, -10], //    facing E wind N => negative
    [0, 90, 10], //     facing N wind E => positive
    [-90, 90, 0], //    facing W wind E => 0
    [180, 90, -10], //  facing S wind E => negative
    [90 + 360, 180, 10] //    facing E wind S => positive
  ])("from reference bearing and wind direction: [%d, %d]", (ref, windDir, exp) => {
    const result = calculateCrosswind(ref, windDir, 10);

    expect(result).toBeCloseTo(exp, 5);
  });
});

describe("calculateHeadwind calculates correctly", () => {
  test.each([
    [0, 10],     // direct headwind
    [180, -10],  // direct tailwind
    [90, 0],     // direct crosswind
    [270, 0],    // direct crosswind 
    [60 + 360, 5],     // quartering headwind
  ])("from angle: %d", (angle, exp) => {
    const result = calculateHeadwind(angle, 10);

    expect(result).toBeCloseTo(exp, 5);
  });

  test.each([
    [360, 90, 0],             // facing N wind E => direct crosswind
    [90, 90, 10],             // facing E wind E => direct headwind
    [270, 90, -10],           // facing W wind E => direct tailwind
    [540, 120, 5],            // facing S wind WSW => quartering headwind
    [540, 60, -5],            // facing S wind WSW => quartering tailwind

  ])("from reference bearing and wind direction: [%d, %d]", (ref, windDir, exp) => {
    const result = calculateHeadwind(ref, windDir, 10);

    expect(result).toBeCloseTo(exp, 5);
  });
});