<template>
  <div class="bearing-input-slider" :class="classes">
    <round-slider
      min="0"
      max="360"
      startAngle="90"
      startValue="360"
      pathColor="#000"
      rangeColor="#000"
      v-model="normalized"
    />
  </div>
</template>

<script>
import { normalizeBearing } from "../../core/utilities/directions";
import RoundSlider from "vue-round-slider";

export default {
  components: { RoundSlider },
  props: {
    value: {
      type: Number,
      default: 360
    },
    classes: {
      value: {
        type: Array,
        default: () => []
      }
    }
  },
  computed: {
    normalized: {
      get: function() {
        return normalizeBearing(this.value);
      },
      set: function(newBearing) {
        let normalized = normalizeBearing(newBearing);
        this.$emit("input", normalized);
      }
    }
  }
};
</script>

<style scoped>
.bearing-input-slider {
  margin: auto;
  display: inline-block;
}
</style>