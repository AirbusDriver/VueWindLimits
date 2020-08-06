<template>
  <div class="runway-information-card-content">
    <h6>Runway Heading: {{ normalizedHeading | heading }}</h6>

    <bearing-input :value="value" @input="updateRunwayHeading" :classes="['bearing']" />
  </div>
</template>

<script>
import { normalizeBearing } from "@/core/utilities/directions";
import BearingInput from "@/components/ui/BearingInput";

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
.runway-information-card-content {
  padding: 0rem 1rem;
}

.bearing {
  padding: 0.5rem;
}
</style>