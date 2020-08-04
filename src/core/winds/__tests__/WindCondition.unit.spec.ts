import WindCondition from "../WindCondition";

describe("WindConditions", () => {
  test("can get / set direction", () => {
    const windCondition = new WindCondition(0, 10);

    expect(windCondition.direction).toBe(360);

    windCondition.direction = 370;

    expect(windCondition.direction).toBe(10);
  });

  test("toString representation", () => {
    expect(new WindCondition(0, 10).toString()).toBe("Winds: 360\u00B0 @ 10")
  });
});