<template>
  <v-menu v-model="showMenu" absolute :position-x="x" :position-y="y" offset-y>
    <template #activator="{ on, attrs }">
      <slot v-bind="attrs" v-on="on" v-bind:context="show">Default slot content</slot>
    </template>
    <v-list>
      <v-list-item @click="openFolder">
        <v-list-item-title>
          <v-icon left>mdi-folder</v-icon>
          {{ $t('actions.openFolder') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Tab } from '@/types';

export default Vue.extend({
  name: 'TabContextMenu',
  props: {
    tab: {
      type: Object as PropType<Tab>,
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
    async openFolder() {
      await window.openFolder(this.tab.id);
    },
  },
});
</script>
