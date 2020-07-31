<template>
  <div class="wind-information card">
    <div class="container center-align">
      <div class="row">
        <div class="col s12">
          <h5>Wind Conditions</h5>
          <span class="manual-entry">
            <h6>
              Winds:
              <span
                @click="manualWindDirection = !manualWindDirection"
              >{{ windDirection | bearing }}</span>
              @ {{ windSpeed }} {{ units }}
            </h6>
            <!-- Manual Inputs -->
            <div v-show="manualWindDirection">
              <label>Enter Manual Wind Direction</label>
              <input
                type="number"
                id="manual-wind-direction"
                :value="windDirection"
                @input="updateWindDirection($event.target.value)"
              />
            </div>
          </span>

          <bearing-input :value="windDirection" @input="updateWindDirection" />

          <input
            type="range"
            :value="windSpeed"
            min="0"
            max="100"
            @input="updateWindSpeed($event.target.value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { normalizeBearing } from "../lib/utilities/directions";
import BearingInput from "./BearingInput";

export default {
  components: { BearingInput },
  props: {
    initialWindSpeed: {
      type: Number,
      default: 20
    },
    initialWindDirection: {
      type: Number,
      default: 0
    },
    units: {
      type: String
    }
  },
  data() {
    return {
      manualWindDirection: false,
      windDirection: this.initialWindDirection,
      windSpeed: this.initialWindSpeed
    };
  },
  computed: {
    windInfo() {
      return {
        direction: this.windDirection,
        speed: this.windSpeed
      };
    }
  },
  filters: {
    bearing: val => {
      return `${val}`.padStart(3, 0);
    }
  },
  methods: {
    updateWindDirection(newDirection) {
      this.windDirection = normalizeBearing(newDirection);
      this.$emit("update:wind-info", this.windInfo);
    },
    updateWindSpeed(newSpeed) {
      this.windSpeed = +newSpeed;
      this.$emit("update:wind-info", this.windInfo);
    },
    normalize(val) {
      return normalizeBearing(val);
    }
  }
};
</script>

<style scoped>
.wind-information {
  padding: 1rem;
}
</style>