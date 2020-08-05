<template>
  <div class="readout crosswind-readout" :class="[exceedenceClass]">
    <slot :normalized="normalized" :sector="sector" :units="units">
      <p>
        Crosswind {{ normalized }} {{ units }}
        <span v-if="sector">from the {{ sector }}</span>
      </p>
    </slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Component from "vue-class-component";
import { ExceedenceSeverity } from "@/core/limitations/interfaces";

type AircraftLimitations = {
  maxCrosswind: number;
  maxTailwind: {
    takeoff: number;
    landing: number;
  };
};

const CrosswindReadoutProps = Vue.extend({
  props: {
    crosswindStrength: Number,
    maxCrosswind: Number,
    units: {
      type: String,
      default: "kts"
    },
    precision: {
      type: Number,
      default: 1
    },
    aircraftLimitations: {
      type: Object as PropType<AircraftLimitations>,
      required: false
    }
  }
});

@Component
export default class CrosswindReadout extends CrosswindReadoutProps {
  round(val: number, decimalPlaces: number): number {
    const useUnits =
      typeof decimalPlaces === "number" ? decimalPlaces : this.precision;
    const multiplier = 10 ** useUnits;
    return Math.round(val * multiplier) / multiplier;
  }

  get sector(): string {
    if (this.normalized === 0) {
      return "";
    }
    if (this.crosswindStrength < 0) {
      return "Left";
    } else {
      return "Right";
    }
  }

  get normalized(): number {
    const roundVal = this.precision;
    const scalar = Math.abs(this.crosswindStrength);
    return this.round(scalar, roundVal);
  }

  get exceedenceSeverity(): ExceedenceSeverity {
    const thresholdPct = 0.8;
    const thresholdSpeed = thresholdPct * this.maxCrosswind;
    const normalizedVal = this.normalized;

    if (normalizedVal < thresholdSpeed) {
      return ExceedenceSeverity.LOW;
    } else if (normalizedVal > this.maxCrosswind) {
      return ExceedenceSeverity.HIGH;
    } else {
      return ExceedenceSeverity.MED;
    }
  }

  get exceedenceClass(): string {
    const exceedence: ExceedenceSeverity = this.exceedenceSeverity;
    const exceedenceClasses = {
      [ExceedenceSeverity.LOW]: "low",
      [ExceedenceSeverity.MED]: "med",
      [ExceedenceSeverity.HIGH]: "high"
    };

    const lookupResult = exceedenceClasses[exceedence];

    return typeof lookupResult !== "undefined"
      ? `exceedence-${lookupResult}`
      : "";
  }
}
</script>


<style scoped>
.exceedence-low {
  color: black;
  transition: all 0.5s;
}
.exceedence-med {
  color: orange;
  transition: all 0.5s;
}
.exceedence-high {
  color: red;
  transition: all 0.5s;
}
</style>
