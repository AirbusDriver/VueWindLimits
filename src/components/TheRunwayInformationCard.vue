<template>
  <div class="runway-information center-align card">
    <div class="row">
      <div class="col s12">
        <h5>Runway Information</h5>
        <h6>Runway Heading: {{ normalizedHeading | heading }}</h6>
      </div>
    </div>
    <bearing-input :value="value" @input="updateRunwayHeading" />
  </div>
</template>

<script>
import { normalizeBearing } from "../lib/utilities/directions";
import BearingInput from "./BearingInput";

export default {
  components: { BearingInput },
  props: {
    value: {
      type: [Number, String],
      default: 360
    }
  },
  methods: {
    updateRunwayHeading: function(value) {
      this.$emit("input", value);
    }
  },
  computed: {
    normalizedHeading() {
      return normalizeBearing(this.value);
    }
  },
  filters: {
    heading: val => {
      return `${val}`.padStart(3, "0") + "\u00B0";
    }
  }
};
</script>

<style scoped>
.runway-information {
  padding: 1rem;
}
</style>