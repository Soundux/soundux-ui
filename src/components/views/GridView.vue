<template>
  <div id="grid-view" class="overflow-y-auto" style="height: calc(100vh - 274px)">
    <v-row no-gutters>
      <v-col v-for="(sound, sIndex) in tab.sounds" :key="sIndex" class="ma-2">
        <v-btn
          :id="`sound-${sound.id}`"
          class="pa-2 text-none"
          :class="{ 'selected-indicator': tab.selectedSoundIndex === sIndex }"
          block
          height="50"
          @click="$store.commit('setSelectedSoundIndex', { tabId: tab.id, index: sIndex })"
          @dblclick="$store.dispatch('playSound', sound)"
        >
          {{ sound.name }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Tab } from '@/types';

export default Vue.extend({
  name: 'GridView',
  props: {
    tab: {
      type: Object as PropType<Tab>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.selected-indicator::after {
  content: '\a0';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  border-top: 5px solid var(--v-primary-base);
  box-shadow: none !important;
  border-radius: 4px;
}
</style>
