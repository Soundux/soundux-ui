<template>
  <v-list id="list-view" :height="380" class="overflow-y-auto">
    <v-list-item-group
      :value="tab.selectedSoundIndex"
      color="primary"
      mandatory
      @change="$store.commit('setSelectedSoundIndex', { tabId: tab.id, index: $event })"
    >
      <v-list-item
        v-for="sound in tab.sounds"
        :id="`sound-${sound.id}`"
        :key="sound.id"
        @dblclick="$store.dispatch('playSound', sound)"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ sound.name }}
          </v-list-item-title>
          <v-list-item-action-text>
            {{ sound.hotkeySequence }}
          </v-list-item-action-text>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Tab } from '@/types';

export default Vue.extend({
  name: 'ListView',
  props: {
    tab: {
      type: Object as PropType<Tab>,
      required: true,
    },
  },
});
</script>
