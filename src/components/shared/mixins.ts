import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";


function rounded(val: number, precision: number = 1): number {
  const multiplier = 10 ** precision;
  return Math.round(multiplier * val) / multiplier;
}

export const Roundable = Vue.extend({
  props: {
    precision: {
      type: Number,
      default: 1
    }
  },
  methods: {
    rounded(val: number, precision?: number): number {
      return rounded(val, precision ? precision : this.precision)
    }
  }
});