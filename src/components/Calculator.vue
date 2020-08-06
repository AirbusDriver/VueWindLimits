<template>
  <div class="calculator container">
    <h3>Wind Calculator</h3>
    <div class="row">
      <div class="col s12">
        <div class="card">
          <the-exceedence-card
            :current-wind-conditions="windConditions"
            :aircraft-limitations="aircraftLimitations"
            :runway-heading="runwayHeading"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col s12">
        <div id="inputs-card" class="card">
          <tabbed-input :tabKeys="['limitations', 'winds', 'runway']" v-slot="{ tabs, toggle }">
            <div class="row">
              <div class="input-selection-group">
                <div class="col s4">
                  <a class="btn toggle-button" @click.capture="toggle('limitations')">
                    <i class="material-icons">airplanemode_active</i>
                  </a>
                </div>
                <div class="col s4">
                  <a class="btn toggle-button" @click.capture="toggle('runway')">
                    <i class="material-icons">navigation</i>
                  </a>
                </div>
                <div class="col s4">
                  <a class="btn toggle-button" @click.capture="toggle('winds')">
                    <i class="material-icons">wb_cloudy</i>
                  </a>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col s12">
                <transition name="fade" mode="out-in">
                  <aircraft-limitations-card-content
                    v-if="tabs.get('limitations')"
                    :aircraft-limitations-data="aircraftLimitationsData"
                    :units="units"
                    @limitationsChanged="updateAircraftLimitations"
                  />

                  <runway-information-card-content
                    v-if="tabs.get('runway')"
                    :value="runwayHeading"
                    @input="runwayHeading = $event"
                  />

                  <wind-information-card-content
                    v-if="tabs.get('winds')"
                    :initial-wind-speed="windInfo.speed"
                    :initial-wind-direction="windInfo.direction"
                    :units="units"
                    @update:wind-info="windInfo = $event"
                  />
                </transition>
              </div>
            </div>
          </tabbed-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { calculateCrosswind } from "../core/windCalculations";
import { AircraftLimitations } from "../core/limitations/interfaces";
import {
  loadAircraftLimitations,
  saveAircraftLimitations
} from "@/core/limitations/persistence";
import TabbedInput from "./ui/TabbedInput.vue";
import AircraftLimitationsCardContent from "./inputs/AircraftLimitationsCardContent.vue";
import RunwayInformationCardContent from "./inputs/RunwayInformationCardContent.vue";
import WindInformationCardContent from "./inputs/WindInformationCardContent.vue";
import { ExceedenceCard as TheExceedenceCard } from "./TheExceedenceCard";
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
  filters: {
    round(value: number, digits = 2): number {
      const multiplier = 10 ** digits;
      return Math.round(value * multiplier) / multiplier;
    }
  },
  components: {
    AircraftLimitationsCardContent,
    RunwayInformationCardContent,
    WindInformationCardContent,
    TheExceedenceCard,
    TabbedInput
  },
  data: function(): CalcData {
    return {
      aircraftLimitationsData: { ...DEFAULT_AIRCRAFT_LIMITATIONS },
      windInfo: { ...initialWindConditions },
      runwayHeading: 0,
      units: "kts"
    };
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
  },
  watch: {
    aircraftLimitationsData: {
      handler: function(newVal: IAircraftLimitationsData) {
        saveAircraftLimitations(this.aircraftLimitations);
      },
      deep: true
    }
  },
  created: function() {
    try {
      const loadedLimitations = loadAircraftLimitations();
      if (loadedLimitations != null) {
        console.debug("loaded limitations from storage", loadedLimitations);
        this.aircraftLimitationsData.maxTailWindTakeoffValue =
          loadedLimitations.maxTailwind.takeoff;
        this.aircraftLimitationsData.maxTailWindLandingValue =
          loadedLimitations.maxTailwind.landing;
        this.aircraftLimitationsData.maxCrossWindValue =
          loadedLimitations.maxCrosswind.takeoff;
      }
    } catch (error) {
      console.error(error);
    }
  }
});
</script>

<style>
.material-icons {
  display: inline-flex;
  vertical-align: top;
}

.input-selection-group {
  padding: 1rem 2rem;
}

.input-selection-group a {
  width: 100%;
}

#inputs-card .bearing {
  padding: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.15s;
}

.fade-enter {
  opacity: 0;
  transform: translateY(-50%) scaleY(0%);
}

.fade-enter-to {
  opacity: 100;
  transform: translateY(0%) scaleY(100%);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) scaleY(0%);
}
</style>