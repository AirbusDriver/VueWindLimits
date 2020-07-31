<template>
  <div class="aircraft-limitations-card card">
    <h3>Provide Aircraft Limitations</h3>

    <div class="input-group">
      <h5>Max Tailwind for Takeoff: {{ maxTakeoffTailwind }} {{ units }}</h5>
      <input
        v-model="maxTakeoffTailwind"
        type="range"
        max="50"
        @change="updateLimitations('maxTailWindTakeoffValue', maxTakeoffTailwind)"
      />
    </div>

    <div class="input-group">
      <h5>Max Tailwind for Landing: {{ maxTailWindLanding }} {{ units }}</h5>
      <input
        v-model="maxTailWindLanding"
        type="range"
        max="50"
        @change="updateLimitations('maxTailWindLandingValue', maxTailWindLanding)"
      />
    </div>

    <div class="input-group">
      <h5>Max Crosswind Including Gusts: {{ maxCrossWind }} {{ units }}</h5>
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
.aircraft-limitations-card {
  padding: 5%;
}
</style>