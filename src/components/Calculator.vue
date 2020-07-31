<template>
  <div class="calculator container center-align">
    <h1>Wind Calculator</h1>
    <div class="row">
      <div class="col s12">
        <aircraft-limitations-card
          :aircraft-limitations-data="aircraftLimitationsData"
          :units="units"
          @limitationsChanged="updateAircraftLimitations"
        />
      </div>
    </div>

    <div class="row">
      <div class="col s12 m6">
        <runway-information-card
          :value="runwayHeading"
          @input="runwayHeading = $event"
          style="height: 400px"
        />
      </div>

      <div class="col s12 m6">
        <wind-information
          :initial-wind-speed="windInfo.speed"
          :initial-wind-direction="windInfo.direction"
          :units="units"
          style="height: 400px"
          @update:wind-info="windInfo = $event"
        />
      </div>

      <div class="col s12">
        <div class="wind-components">
          <CrosswindReadout
            :crosswind-strength="crosswind"
            :maxCrosswind="aircraftLimitationsData.maxCrossWindValue"
          ></CrosswindReadout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateCrosswind } from "../lib/windCalculations";
import AircraftLimitationsCard from "./AircraftLimitationsCard";
import RunwayInformationCard from "./TheRunwayInformationCard";
import WindInformation from "./WindInformation";
import CrosswindReadout from "./CrosswindReadout";

const DEFAULT_AIRCRAFT_LIMITATIONS = {
  maxTailWindTakeoffValue: 15,
  maxTailWindLandingValue: 10,
  maxCrossWindValue: 38
};

let initialWindConditions = {
  speed: 20,
  direction: 0
};

export default {
  name: "Calculator",
  data: function() {
    return {
      aircraftLimitationsData: Object.assign({}, DEFAULT_AIRCRAFT_LIMITATIONS),
      windInfo: Object.assign({}, initialWindConditions),
      runwayHeading: 0,
      units: "kts"
    };
  },
  components: {
    AircraftLimitationsCard,
    RunwayInformationCard,
    WindInformation,
    CrosswindReadout
  },
  computed: {
    crosswind: function() {
      return calculateCrosswind(
        this.windInfo.direction - this.runwayHeading,
        this.windInfo.speed
      );
    }
  },
  filters: {
    round(value, digits = 2) {
      const multiplier = 10 ** digits;
      return Math.round(value * multiplier) / multiplier;
    }
  },
  methods: {
    updateAircraftLimitations: function(key, value) {
      if (!(key in this.aircraftLimitationsData)) {
        throw new Error(`${key}: ${value} not in aircraftLimitationsData`);
      }
      this.aircraftLimitationsData[key] = parseInt(value);
      console.debug(`updating aircraft limitations - ${key}: ${value}`);
    }
  }
};
</script>
