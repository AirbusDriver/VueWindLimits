<template>
  <div class="wind-information-card">
    <div class="container center-align">
      <span class="manual-entry">
        <h5
          @click="manualWindSpeed = !manualWindSpeed"
        >Winds: {{ windDirection | bearing }} @ {{ windSpeed }} {{ units }}</h5>
        <!-- Manual Inputs -->
        <div v-show="manualWindSpeed">
          <label>Enter Manual Wind Speed</label>
          <input
            type="text"
            :value="windSpeed"
            min="0"
            max="100"
            @input="updateWindSpeed($event.target.value)"
          />
        </div>
      </span>

      <toggle-card>
        <template v-slot:button="btnProps">
          <button class="waves-effect btn" @click.capture="btnProps.toggle">
            <i class="material-icons">{{ btnProps.hidden ? "edit" : "done" }}</i> Wind Conditions
          </button>
        </template>
        <bearing-input :value="windDirection" @input="updateWindDirection" :classes="['bearing']" />
        <input
          type="range"
          min="0"
          max="100"
          :value="windSpeed"
          @input="updateWindSpeed($event.target.value)"
        />
      </toggle-card>
    </div>
  </div>
</template>

<script>
import { normalizeBearing } from "../core/utilities/directions";
import BearingInput from "../components/ui/BearingInput";
import ToggleCard from "./ToggleCard";

export default {
  components: { BearingInput, ToggleCard },
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
      manualWindSpeed: false,
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
.wind-information-card {
  padding: 1rem;
}

.bearing {
  padding: 1rem;
}
</style>