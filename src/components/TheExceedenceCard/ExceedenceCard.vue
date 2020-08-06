<template>
  <div class="exceedence-card-content">
    <button id="data-btn" class="wave-effect btn" @click.capture="toggle()">
      <i
        class="material-icons"
      >{{ takeoffOrLanding === "takeoff" ? "flight_takeoff" : "flight_land" }}</i>
    </button>

    <ul class="collection with-header">
      <li class="collection-header">
        <h6>Winds: {{ windReadoutText }}</h6>
        <h6>Runway: {{ runwayHeading + '\u00B0'}}</h6>
      </li>
      <li
        id="crosswind-details"
        class="collection-item"
        :class="exceedenceClasses.crosswind"
      >{{ crosswindReadoutText }}</li>
      <li
        id="tailwind-details"
        class="collection-item"
        :class="exceedenceClasses.tailwind"
      >{{ headwindReadoutText }}</li>
    </ul>
  </div>
</template>


<script lang="ts">
import Vue, { PropType } from "vue";
import { Roundable } from "@/components/shared/mixins";
import mixins from "vue-typed-mixins";
import { WindCondition } from "@/core/winds";
import { calculateCrosswind, calculateHeadwind } from "@/core/windCalculations";
import {
  AircraftLimitations,
  ExceedenceSeverity
} from "@/core/limitations/interfaces";

const WARNING_THRESHOLD = 0.7; // exceedences are MED >= this percentage

const suffixes = new Map<ExceedenceSeverity | "error", String>();
suffixes.set(ExceedenceSeverity.LOW, "low");
suffixes.set(ExceedenceSeverity.MED, "med");
suffixes.set(ExceedenceSeverity.HIGH, "high");
suffixes.set("error", "error");

const EXCEEDENCE_CLASS_PREFIX = "exceedence-";

type CurrentExceedences = {
  tailwind: {
    takeoff: ExceedenceSeverity | "error";
    landing: ExceedenceSeverity | "error";
  };
  crosswind: ExceedenceSeverity | "error";
};

type TakeoffOrLanding = "takeoff" | "landing";

function calcCurrentExceedences(
  wind: WindCondition,
  runwayHdg: number,
  limitations: AircraftLimitations
): CurrentExceedences {
  const crosswindValue = Math.abs(
    calculateCrosswind(runwayHdg, wind.direction, wind.speed)
  );
  const headwindValue = calculateHeadwind(
    runwayHdg,
    wind.direction,
    wind.speed
  );
  const maxToValue = -limitations.maxTailwind.takeoff;
  const maxLdgValue = -limitations.maxTailwind.landing;
  const maxCrossValue = limitations.maxCrosswind.takeoff;

  let crosswind: ExceedenceSeverity,
    takeoff: ExceedenceSeverity,
    landing: ExceedenceSeverity;

  const out: CurrentExceedences = {
    tailwind: {
      takeoff: "error",
      landing: "error"
    },
    crosswind: "error"
  };

  if (crosswindValue > maxCrossValue) {
    out.crosswind = ExceedenceSeverity.HIGH;
  } else if (crosswindValue < maxCrossValue * WARNING_THRESHOLD) {
    out.crosswind = ExceedenceSeverity.LOW;
  } else {
    out.crosswind = ExceedenceSeverity.MED;
  }

  if (headwindValue >= 0) {
    out.tailwind.takeoff = out.tailwind.landing = ExceedenceSeverity.LOW;
    return out;
  }
  if (headwindValue < maxToValue) {
    out.tailwind.takeoff = ExceedenceSeverity.HIGH;
  } else if (headwindValue > maxToValue * WARNING_THRESHOLD) {
    out.tailwind.takeoff = ExceedenceSeverity.LOW;
  } else {
    out.tailwind.takeoff = ExceedenceSeverity.MED;
  }

  if (headwindValue < maxLdgValue) {
    out.tailwind.landing = ExceedenceSeverity.HIGH;
  } else if (headwindValue > maxLdgValue * WARNING_THRESHOLD) {
    out.tailwind.landing = ExceedenceSeverity.LOW;
  } else {
    out.tailwind.landing = ExceedenceSeverity.MED;
  }

  return out;
}

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
  data: (): { takeoffOrLanding: TakeoffOrLanding } => {
    return {
      takeoffOrLanding: "takeoff"
    };
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

        return `${dirText}\u00B0 @ ${speedText} kts`;
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
    },
    currentExceedences: {
      get: function(): CurrentExceedences {
        return calcCurrentExceedences(
          this.currentWindConditions,
          this.runwayHeading,
          this.aircraftLimitations
        );
      }
    },
    exceedenceClasses: {
      get: function(): {
        tailwind: String;
        crosswind: String;
      } {
        const dataSelection = this.takeoffOrLanding;

        const crosswind =
          suffixes.get(this.currentExceedences.crosswind) || "error";

        let tailwind: String;

        if (dataSelection === "takeoff") {
          tailwind =
            suffixes.get(this.currentExceedences.tailwind.takeoff) || "error";
        } else {
          tailwind =
            suffixes.get(this.currentExceedences.tailwind.landing) || "error";
        }

        return {
          tailwind: `${EXCEEDENCE_CLASS_PREFIX}${tailwind}`,
          crosswind: `${EXCEEDENCE_CLASS_PREFIX}${crosswind}`
        };
      }
    }
  },
  methods: {
    toggle(): TakeoffOrLanding {
      const newVal =
        this.takeoffOrLanding === "takeoff" ? "landing" : "takeoff";
      this.takeoffOrLanding = newVal;
      return newVal;
    }
  }
});
</script>

<style scoped>
.exceedence-low {
  background-color: rgb(180, 255, 180) !important;
}

.exceedence-med {
  background-color: rgb(247, 174, 174) !important;
}

.exceedence-high {
  background-color: rgb(255, 97, 97) !important;
}

ul > li.collection-item {
  margin: 1rem;
}

#data-btn {
  margin: 10px;
}
</style>