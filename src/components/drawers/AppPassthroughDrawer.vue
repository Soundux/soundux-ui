<template>
  <v-navigation-drawer v-model="appPassThroughDrawer" fixed left temporary width="auto">
    <v-toolbar color="primary">
      <v-toolbar-title class="text-subtitle-1">
        <v-icon left>mdi-cable-data</v-icon>
        {{ $t('appPassThrough') }}
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
import { Output } from '@/types';

export default Vue.extend({
  name: 'AppPassthroughDrawer',
  data() {
    return {
      keyDownHandler: (null as unknown) as (event: KeyboardEvent) => void | null,
    };
  },
  computed: {
    appPassThroughDrawer: {
      get() {
        return this.$store.getters.appPassThroughDrawer;
      },
      set(newValue: boolean) {
        this.$store.commit('setAppPassThroughDrawer', newValue);
      },
    },
  },
  mounted() {
    this.$store.dispatch('getPlaybackApps');
    this.keyDownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.code === 'KeyG') {
        event.preventDefault();
        this.appPassThroughDrawer = !this.appPassThroughDrawer;
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
      this.appPassThroughDrawer = false;
    },
  },
});
</script>

<style scoped></style>