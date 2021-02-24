<template>
  <v-navigation-drawer v-model="drawer" absolute left temporary width="auto">
    <v-toolbar color="primary">
      <v-toolbar-title class="text-subtitle-1">
        <v-icon left>mdi-cable-data</v-icon>
        Application pass through
        <v-icon right @click="$store.dispatch('getPlaybackApps')">mdi-reload</v-icon>
      </v-toolbar-title>
    </v-toolbar>
    <v-list nav dense>
      <v-list-item
        v-for="(result, index) in $store.getters.playbackApps"
        :key="index"
        @click="startPassthrough(result)"
      >
        <v-list-item-title class="text-wrap">{{ result.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { Output } from '~/types';

export default Vue.extend({
  name: 'AppPassthroughDrawer',
  data() {
    return {
      drawer: false,
      keyDownHandler: (null as unknown) as (event: KeyboardEvent) => void | null,
    };
  },
  mounted() {
    this.$store.dispatch('getPlaybackApps');
    this.keyDownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === 'KeyG') {
        event.preventDefault();
        this.drawer = !this.drawer;
      }
    };
    document.addEventListener('keydown', this.keyDownHandler);
  },
  destroyed() {
    if (this.keyDownHandler) {
      document.removeEventListener('keydown', this.keyDownHandler);
    }
  },
  methods: {
    startPassthrough(app: Output) {
      this.$store.dispatch('startPassthrough', app);
      this.drawer = false;
    },
  },
});
</script>

<style scoped></style>
