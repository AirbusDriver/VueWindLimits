<template>
  <div class="readout headwind-readout">
    <slot name="readout">{{ formatted }}</slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Component from "vue-class-component";

/**
 * Component to display the current wind component strength and display any exceedences
 *
 * Required data: headwind component, exceedence threshold
 */
const WindComponentDisplayProps = Vue.extend({
  props: {
    windComponentStrength: {
      type: Number,
      required: true
    },
    limitationCheck: {
      type: Function,
      required: true
    }
  }
});

@Component
export default class WindComponentReadout extends WindComponentDisplayProps {}
