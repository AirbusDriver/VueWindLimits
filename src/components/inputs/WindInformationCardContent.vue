<template>
  <div class="wind-information-card">
    <div class="center-align">
      <span class="manual-entry">
        <h6
          @click="manualWindSpeed = !manualWindSpeed"
        >Winds: {{ windDirection | bearing }} @ {{ windSpeed }} {{ units }}</h6>
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

      <bearing-input :value="windDirection" @input="updateWindDirection" :classes="['bearing']" />
      <input
        type="range"
        min="0"
        max="100"
        :value="windSpeed"
        @input="updateWindSpeed($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { normalizeBearing } from "@/core/utilities/directions";
import { paddedDirection } from "@/components/shared/filters";
import BearingInput from "@/components/ui/BearingInput";

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
      return paddedDirection(val);
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
  padding: 0rem 1rem;
}
</style>