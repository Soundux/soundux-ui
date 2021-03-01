<template>
  <div class="overflow-y-auto" style="height: calc(100vh - 305px)">
    <v-row id="grid-view" no-gutters>
      <template v-for="(sound, sIndex) in tab.sounds">
        <v-col :key="sIndex" class="ma-2">
          <v-btn
            :id="`sound-${sound.id}`"
            class="pa-2 text-none"
            :class="{ 'selected-indicator': tab.selectedSoundIndex === sIndex }"
            block
            height="50"
            @click="$store.commit('setSelectedSoundIndex', { tabId: tab.id, index: sIndex })"
          >
            {{ sound.name }}
          </v-btn>
        </v-col>
      </template>
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
