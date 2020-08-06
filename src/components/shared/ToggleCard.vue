<template>
  <div class="toggle-card">
    <slot name="button" :hidden="hidden" :toggle="toggle">
      <button :class="buttonClasses" @click="handleClick">{{ hidden ? 'SHOW' : 'HIDE' }}</button>
    </slot>
    <div class="toggle-card-content" v-show="hidden == false">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ToggleCard",
  props: {
    initiallyHidden: {
      type: Boolean,
      default: false
    },
    buttonClasses: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      hidden: this.initiallyHidden
    };
  },
  methods: {
    toggle() {
      this.hidden = !this.hidden;
    },
    hide() {
      this.hidden = true;
    },
    show() {
      this.hidden = false;
    },
    handleClick() {
      this.toggle();
    }
  }
});
</script>