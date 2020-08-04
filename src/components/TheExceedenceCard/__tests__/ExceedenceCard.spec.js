import { mount, Wrapper } from "@vue/test-utils";
import { ExceedenceCard } from "../index";
import { AircraftLimitations } from "@/core/interfaces";
import { WindCondition } from "@/core/winds";

const testAircraftLimitations = {
    maxCrosswind: { landing: 10, takeoff: 15 },
    maxTailwind: { landing: 38, takeoff: 38 },
};

const testWindCondition = new WindCondition(30, 10);

const testRunwayDirection = 360;

const getWrapper = () => {
    return mount(ExceedenceCard, {
        propsData: {
            currentWindConditions: testWindCondition,
            aircraftLimitations: testAircraftLimitations,
            runwayHeading: testRunwayDirection,
        },
    });
};

describe("ExceedenceCard", () => {
    test("normalizedHeadwind lifecycle", () => {
        const wrapper = getWrapper();
        let result = wrapper.vm.normalizedHeadwind;

        expect(result).toBe(8.7);

        wrapper.setProps({
            currentWindConditions: new WindCondition(60, 10),
            runwayHeading: 120,
        });

        result = wrapper.vm.normalizedHeadwind;

        expect(result).toBe(5);
    });
});
