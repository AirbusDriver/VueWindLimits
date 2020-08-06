<template>
  <div class="aircraft-limitations-card">
    <ToggleCard>
      <template v-slot:button="btnProps">
        <button class="waves-effect btn" @click.capture="btnProps.toggle">
          <i class="material-icons">{{ btnProps.hidden ? "edit" : "done" }}</i> Aircraft Limitations
        </button>
      </template>
      <template v-slot>
        <div class="input-group">
          <h6>Max Tailwind for Takeoff: {{ maxTakeoffTailwind }} {{ units }}</h6>
          <input
            v-model="maxTakeoffTailwind"
            type="range"
            max="50"
            @change="updateLimitations('maxTailWindTakeoffValue', maxTakeoffTailwind)"
          />
        </div>

        <div class="input-group">
          <h6>Max Tailwind for Landing: {{ maxTailWindLanding }} {{ units }}</h6>
          <input
            v-model="maxTailWindLanding"
            type="range"
            max="50"
            @change="updateLimitations('maxTailWindLandingValue', maxTailWindLanding)"
          />
        </div>

        <div class="input-group">
          <h6>Max Crosswind with Gusts: {{ maxCrossWind }} {{ units }}</h6>
          <input
            v-model="maxCrossWind"
            type="range"
            max="75"
            @change="updateLimitations('maxCrossWindValue', maxCrossWind)"
          />
        </div>
      </template>
    </ToggleCard>
  </div>
</template>


<script>
import ToggleCard from "./ToggleCard";

export default {
  components: { ToggleCard },
  props: {
    "aircraft-limitations-data": { type: Object },
    units: { type: String }
  },
  data: function() {
    return {
      maxTakeoffTailwind: this.aircraftLimitationsData.maxTailWindTakeoffValue,
      maxTailWindLanding: this.aircraftLimitationsData.maxTailWindLandingValue,
      maxCrossWind: this.aircraftLimitationsData.maxCrossWindValue
    };
  },
  methods: {
    updateLimitations: function(key, value) {
      this.$emit("limitationsChanged", key, value);
    }
  }
};
</script>

<style scoped>
.aircraft-limitations-card {
  padding: 1rem;
}
</style>