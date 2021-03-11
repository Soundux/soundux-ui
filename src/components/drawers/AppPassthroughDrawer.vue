<template>
  <v-navigation-drawer v-model="appPassThroughDrawer" fixed left temporary width="auto">
    <v-toolbar dark color="primary">
      <v-toolbar-title class="text-subtitle-1">
        <v-icon left>mdi-cable-data</v-icon>
        {{ $t('appPassThrough.title') }}
      </v-toolbar-title>
      <v-toolbar-items class="ml-auto">
        <v-btn icon block class="ml-3 mr-n4" @click="$store.dispatch('getPlaybackApps')">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list v-if="$store.getters.playbackApps.length > 0" nav dense>
      <v-list-item
        v-for="(result, index) in $store.getters.playbackApps"
        :key="index"
        @click="startPassthrough(result.name)"
      >
        <v-list-item-title class="text-wrap">{{ result.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-else>
      <v-row class="mx-5 mt-6" justify="center">
        <v-img src="../../assets/undraw_Taken_re_yn20.svg" width="232" contain></v-img>
      </v-row>
      <v-row class="mt-5" justify="center">
        <span>{{ $t('appPassThrough.noAppsFound') }}</span>
      </v-row>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { Output } from '@/types';

export default Vue.extend({
  name: 'AppPassthroughDrawer',
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
    document.addEventListener('keydown', this.keyDownHandler);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
  },
  methods: {
    startPassthrough(app: string): void {
      this.$store.dispatch('startPassthrough', app);
      this.appPassThroughDrawer = false;
    },
    keyDownHandler(event: KeyboardEvent): void {
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.code === 'KeyG') {
        event.preventDefault();
        this.appPassThroughDrawer = !this.appPassThroughDrawer;
      }
    },
  },
});
</script>

<style scoped></style>
