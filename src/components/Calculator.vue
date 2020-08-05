<template>
  <div class="calculator container">
    <h3>Wind Calculator</h3>
    <div class="row">
      <div class="col s12">
        <aircraft-limitations-card
          :aircraft-limitations-data="aircraftLimitationsData"
          :units="units"
          @limitationsChanged="updateAircraftLimitations"
        />
      </div>

      <div class="col s12 m6">
        <runway-information-card :value="runwayHeading" @input="runwayHeading = $event" />
      </div>

      <div class="col s12 m6">
        <wind-information
          :initial-wind-speed="windInfo.speed"
          :initial-wind-direction="windInfo.direction"
          :units="units"
          @update:wind-info="windInfo = $event"
        />
      </div>

      <div class="col s12">
        <the-exceedence-card
          :current-wind-conditions="windConditions"
          :aircraft-limitations="aircraftLimitations"
          :runway-heading="runwayHeading"
        ></the-exceedence-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { calculateCrosswind } from "../core/windCalculations";
import { AircraftLimitations } from "../core/limitations/interfaces";
import AircraftLimitationsCard from "./TheAircraftLimitationsCard.vue";
import RunwayInformationCard from "./TheRunwayInformationCard.vue";
import { ExceedenceCard as TheExceedenceCard } from "./TheExceedenceCard";
import WindInformation from "./TheWindInformation.vue";
import { WindCondition } from "../core/winds";

const DEFAULT_AIRCRAFT_LIMITATIONS = {
  maxTailWindTakeoffValue: 15,
  maxTailWindLandingValue: 10,
  maxCrossWindValue: 38
};

let initialWindConditions = {
  speed: 20,
  direction: 0
};

interface IAircraftLimitationsData {
  maxTailWindTakeoffValue: number;
  maxTailWindLandingValue: number;
  maxCrossWindValue: number;
}

interface CalcData {
  aircraftLimitationsData: IAircraftLimitationsData;
  windInfo: { speed: number; direction: number };
  runwayHeading: number;
  units: string;
}

export default Vue.extend({
  name: "Calculator",
  data: function(): CalcData {
    return {
      aircraftLimitationsData: { ...DEFAULT_AIRCRAFT_LIMITATIONS },
      windInfo: { ...initialWindConditions },
      runwayHeading: 0,
      units: "kts"
    };
  },
  components: {
    AircraftLimitationsCard,
    RunwayInformationCard,
    WindInformation,
    TheExceedenceCard
  },
  computed: {
    crosswind: function(): number {
      return calculateCrosswind(
        this.windInfo.direction - this.runwayHeading,
        this.windInfo.speed
      );
    },
    windConditions: function(): WindCondition {
      return new WindCondition(this.windInfo.direction, this.windInfo.speed);
    },
    aircraftLimitations: function(): AircraftLimitations {
      return {
        maxCrosswind: {
          takeoff: this.aircraftLimitationsData.maxCrossWindValue,
          landing: this.aircraftLimitationsData.maxCrossWindValue
        },
        maxTailwind: {
          takeoff: this.aircraftLimitationsData.maxTailWindTakeoffValue,
          landing: this.aircraftLimitationsData.maxTailWindLandingValue
        }
      };
    }
  },
  filters: {
    round(value: number, digits = 2): number {
      const multiplier = 10 ** digits;
      return Math.round(value * multiplier) / multiplier;
    }
  },
  methods: {
    updateAircraftLimitations: function(
      key: keyof IAircraftLimitationsData,
      value: any
    ) {
      if (!(key in this.aircraftLimitationsData)) {
        throw new Error(`${key}: ${value} not in aircraftLimitationsData`);
      }

      this.aircraftLimitationsData[key] = parseInt(value);
      console.debug(`updating aircraft limitations - ${key}: ${value}`);
    }
  }
});
</script>

<style>
.material-icons {
  display: inline-flex;
  vertical-align: top;
}
</style>