<template>
  <div class="exceedence-card card">
    <p>Winds: {{ windReadoutText }}</p>
    <p>Crosswind: {{ crosswindReadoutText }}</p>
    <p>Head[Tail]wind: {{ headwindReadoutText }}</p>
  </div>
</template>


<script lang="ts">
import Vue, { PropType } from "vue";
import { Roundable } from "@/components/shared/mixins";
import mixins from "vue-typed-mixins";
import { WindCondition } from "@/core/winds";
import { calculateCrosswind, calculateHeadwind } from "@/core/windCalculations";
import { AircraftLimitations } from "@/core/limitations/interfaces";

export default mixins(Roundable).extend({
  name: "ExceedenceCard",
  props: {
    currentWindConditions: {
      type: Object as PropType<WindCondition>
    },
    aircraftLimitations: {
      type: Object as PropType<AircraftLimitations>
    },
    runwayHeading: {
      type: Number,
      default: 0
    }
  },
  computed: {
    normalizedHeadwind: {
      get: function(): number {
        const { direction, speed } = this.currentWindConditions;
        return this.rounded(
          calculateHeadwind(this.runwayHeading, direction, speed)
        );
      }
    },
    normalizedCrosswind: {
      get: function(): number {
        const { direction, speed } = this.currentWindConditions;
        return this.rounded(
          calculateCrosswind(this.runwayHeading, direction, speed)
        );
      }
    },
    crosswindReadoutText: {
      get: function(): string {
        let suffix: string;
        const xWindVal = this.rounded(this.normalizedCrosswind);

        if (xWindVal === 0) suffix = "";
        else if (xWindVal < 0) suffix = "from the LEFT";
        else suffix = "from the RIGHT";
        return `${Math.abs(xWindVal)} kts ${suffix}`;
      }
    },
    headwindReadoutText: {
      get: function(): string {
        const headwindVal = this.normalizedHeadwind;
        const headTail = headwindVal < 0 ? "TAIL" : "HEAD";

        return `${Math.abs(headwindVal)} kts ${headTail}WIND`;
      }
    },
    windReadoutText: {
      get: function(): string {
        const dirText = `${this.currentWindConditions.direction}`.padStart(
          3,
          "0"
        );
        const speedText = `${this.currentWindConditions.speed}`;

        return `${dirText} @ ${speedText} kts`;
      }
    },
    rawHeadwindValue: {
      get: function(): number {
        const { direction, speed } = this.currentWindConditions;
        return calculateHeadwind(this.runwayHeading, direction, speed);
      }
    },
    rawCrosswindValue: {
      get: function(): number {
        const { direction, speed } = this.currentWindConditions;
        return calculateCrosswind(this.runwayHeading, direction, speed);
      }
    }
  }
});
</script>