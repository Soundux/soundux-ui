<template>
  <v-list id="list-view" class="overflow-y-auto" style="height: calc(100vh - 283px)">
    <v-list-item-group active-class="no-active">
      <v-list-item
        v-for="sound in tab.sounds"
        :key="sound.id"
        :id="`sound-${sound.id}`"
        @click="$store.dispatch('playSound', sound)"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ sound.name }}
          </v-list-item-title>
          <v-list-item-action-text>
            {{ sound.hotkeySequence }}
          </v-list-item-action-text>
        </v-list-item-content>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click.stop="$store.commit('setSetHotkeySound', sound)">
              <v-icon>mdi-keyboard</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('hotkeys.title') }}</span>
        </v-tooltip>
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

<style lang="scss">
.v-list-item--active.no-active:not(:focus):not(:hover)::before {
  opacity: 0 !important;
}
</style>
