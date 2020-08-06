<template>
  <div class="tabbed-input-content">
    <slot :active="active" :toggle="toggle" :tabs="tabs"></slot>
  </div>
</template>


<script lang="ts">
import Vue, { PropType } from "vue";
import { Prop } from "vue/types/options";

type TabbedData = {
  tabs: TabsState;
};

type TabsState = Map<string, boolean>;

function createNewTabState(tabs: string[], activeKey?: string): TabsState {
  const state: TabsState = new Map();
  if (activeKey != null && !tabs.includes(activeKey)) {
    throw new Error(`${activeKey} not in ${tabs}`);
  }

  tabs.forEach(t => state.set(t, activeKey === t ? true : false));
  return state;
}

export default Vue.extend({
  props: {
    tabKeys: {
      type: Array as PropType<string[]>,
      default: []
    }
  },
  data: function(): TabbedData {
    return { tabs: createNewTabState(this.tabKeys) };
  },
  computed: {
    tabsState: {
      get: function(): TabsState {
        return this.tabs;
      },
      set: function(tabsState: TabsState) {
        this.tabs = tabsState;
      }
    }
  },
  methods: {
    active: function(key: string): boolean {
      console.debug(`checking ${key}`);
      const activeState = this.tabs.get(key);

      if (typeof activeState == "undefined") {
        throw new Error(
          `can not get state for key: '${key}' in tabs: '${[
            ...this.tabs.keys()
          ]}'`
        );
      }
      return activeState;
    },
    toggle: function(key: string) {
      try {
        const state = this.active(key);
        const newState = !state;
        console.debug(`toggling ${key} from ${state} to ${!state}`);
        this.tabsState = createNewTabState([...this.tabs.keys()]);
        if (newState) {
          this.tabsState.set(key, true);
        }
      } catch (error) {
        console.error(
          `could not toggle key: '${key}' in '${[...this.tabs.keys()]}'`
        );
      }
    }
  }
});
</script>