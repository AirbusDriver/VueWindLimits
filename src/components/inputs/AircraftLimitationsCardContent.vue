<template>
  <div class="aircraft-limitations-content">
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
  </div>
</template>


<script>
export default {
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
.aircraft-limitations-content {
  padding: 0rem 1rem;
}
</style>