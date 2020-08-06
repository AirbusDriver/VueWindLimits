import { mount } from "@vue/test-utils";
import Vue from "vue";

import ToggleCard from "../ToggleCard";

const DEFAULT_PROPS = Object.freeze({
    initiallyHidden: false,
});

const DEFAULT_OPTIONS = Object.freeze({
    propsData: DEFAULT_PROPS,
});

const getWrapper = mountOptions => {
    const mixedOptions = typeof mountOptions === "object" ? mountOptions : {};
    const componentOptions = Object.assign({}, DEFAULT_OPTIONS, mixedOptions);

    return mount(ToggleCard, componentOptions);
};

describe("ToggleCard", () => {
    test("is initially hidden is 'initiallyHidden' == true", () => {
        const wrapper = getWrapper({ propsData: { initiallyHidden: false } });

        expect(wrapper.vm.hidden).toBe(false);
    });

    test("toggle", () => {
        const wrapper = getWrapper();

        expect(wrapper.vm.hidden).toBe(false);

        wrapper.vm.toggle();

        expect(wrapper.vm.hidden).toBe(true);
    });

    test("button renders when hidden true and false", async () => {
        const wrapper = getWrapper({
            propsData: { initiallyHidden: false },
        });

        let button = wrapper.find("button");

        expect(button.exists()).toBe(true);

        wrapper.vm.toggle();

        await Vue.nextTick();

        expect(button.exists()).toBe(true);
    });

    describe("default button text", () => {
        const wrapper = getWrapper();
        const button = wrapper.find("button");

        test("'SHOW' when hidden == true", async () => {
            wrapper.setData({ hidden: true });

            await Vue.nextTick();

            expect(button.text()).toBe("SHOW");
        });

        test("'HIDE' when hidden == false", async () => {
            wrapper.setData({ hidden: false });

            await Vue.nextTick();

            expect(button.text()).toBe("HIDE");
        });
    });
});
