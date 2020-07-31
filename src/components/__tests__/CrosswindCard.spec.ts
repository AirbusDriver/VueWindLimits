import { mount } from "@vue/test-utils";
import { Component } from "vue";
import CrosswindReadout from "@/components/CrosswindReadout.vue";
import ExceedenceSeverity from "@/components/shared/exceedences";

describe("CrosswindReadout", () => {
  test("computes sector correctly", () => {
    const wrapper = mount(CrosswindReadout, {
      propsData: {
        crosswindStrength: -10,
      },
    });

    const model: any = wrapper.vm

    expect(model.sector).toBe("Left");

    wrapper.setProps({
      crosswindStrength: 10,
    });

    expect(model.sector).toBe("Right");

    wrapper.setProps({
      crosswindStrength: 0,
    });

    expect(model.sector).toBe("");
  });

  test("has no sector below min value", () => {
    const wrapper = mount(CrosswindReadout, {
      propsData: {
        crosswindStrength: 0.01,
      },
    });


    expect((<any>wrapper).vm.sector).toBe("");
  });

  test("exceedence severity", () => {
    let wrapper = mount(CrosswindReadout, {
      propsData: {
        crosswindStrength: 20,
        maxCrosswind: 100,
      },
    });

    expect((<any>wrapper).vm.exceedenceSeverity).toBe(ExceedenceSeverity.LOW);

    wrapper.setProps({
      maxCrosswind: 1,
    });

    expect((<any>wrapper).vm.exceedenceSeverity).toBe(ExceedenceSeverity.HIGH);

    wrapper.setProps({
      maxCrosswind: 10,
      crosswindStrength: 8,
    });

    expect((<any>wrapper).vm.exceedenceSeverity).toBe(ExceedenceSeverity.MED);
  });

  describe("exceedences are handled correctly", () => {
    const expectedExceedenceClassInputResultSet = [
      [ExceedenceSeverity.LOW, "exceedence-low"],
      [ExceedenceSeverity.MED, "exceedence-med"],
      [ExceedenceSeverity.HIGH, "exceedence-high"],
    ];
    /*
    For each severity level, the component should add the corresponding 'exceedence-<level>' 
    class on the component that has the 'crosswind-readout' class
    */

    describe.each(expectedExceedenceClassInputResultSet)(
      "exceedenceClass computed property: '%s' should return '%s'",
      (level, exp) => {
        let wrapper: any;

        beforeAll(() => {
          wrapper = mount(CrosswindReadout, {
            computed: {
              exceedenceSeverity: {
                get: () => level
              }
            }
          });
        });

        test(`exceedenceClass returns ${exp} correctly`, () => {
          expect(<any>wrapper.vm.exceedenceClass).toBe(exp);
        });

        test(`element has css class assigned accordingly`, () => {
          const elem = wrapper.find(".crosswind-readout");
          expect(elem.classes()).toContain(exp);
        });
      }
    );
  });
});
