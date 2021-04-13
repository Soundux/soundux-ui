<template>
  <v-menu v-model="showMenu" absolute :position-x="x" :position-y="y" offset-y>
    <template #activator="{ on, attrs }">
      <slot v-bind="attrs" v-on="on" v-bind:context="show">Default slot content</slot>
    </template>
    <v-list>
      <v-list-item
        v-if="$store.getters.settings.gridView || $store.getters.settings.launchPadMode"
        @click="$store.commit('setSetHotkeySound', sound)"
      >
        <v-list-item-title>
          <v-icon left>mdi-keyboard</v-icon>
          {{ $t('hotkeys.title') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Sound } from '@/types';
export default Vue.extend({
  name: 'SoundContextMenu',
  props: {
    sound: {
      type: Object as PropType<Sound>,
      required: true,
    },
  },
  data() {
    return {
      showMenu: false,
      x: 0,
      y: 0,
    };
  },
  methods: {
    show(e: MouseEvent) {
      e.preventDefault();
      this.x = e.clientX;
      this.y = e.clientY;
      this.showMenu = true;
    },
  },
});
</script>
