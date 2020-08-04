<template>
  <div class="runway-information-card card">
    <h5>Runway Heading: {{ normalizedHeading | heading }}</h5>

    <toggle-card>
      <template v-slot:button="btnProps">
        <button class="waves-effect btn" @click="btnProps.toggle">
          <i class="material-icons">{{ btnProps.hidden ? 'edit' : 'done' }}</i> Runway Info
        </button>
      </template>
      <bearing-input :value="value" @input="updateRunwayHeading" :classes="['bearing']" />
    </toggle-card>
  </div>
</template>

<script>
import { normalizeBearing } from "../core/utilities/directions";
import ToggleCard from "./ToggleCard";
import BearingInput from "./BearingInput";

export default {
  components: { BearingInput, ToggleCard },
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
.runway-information-card {
  padding: 1rem;
}

.bearing {
  padding: 1rem;
}
</style>