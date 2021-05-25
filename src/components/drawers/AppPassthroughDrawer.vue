<template>
  <v-navigation-drawer v-model="appPassThroughDrawer" fixed left temporary width="300px">
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
    <template
      v-if="$store.getters.selectedOutputs.length === 0 && !$store.getters.settings.useAsDefaultDevice"
    >
      <v-row class="mx-5 mt-6" justify="center">
        <v-img src="@/assets/undraw_dropdown_menu_vv9j.svg" width="232" contain></v-img>
      </v-row>
      <div class="mx-3 mt-5 text-wrap text-center">
        <span>{{ $t('appPassThrough.noOutputSelected') }}</span>
      </div>
    </template>
    <v-list v-else-if="$store.getters.playbackApps.length > 0" nav dense>
      <v-list-item
        v-for="(playbackApp, index) in $store.getters.playbackApps"
        :key="index"
        @click="startPassthrough(playbackApp)"
      >
        <v-list-item-icon v-if="playbackApp.appIcon" class="mr-1">
          <img
            :src="`data:image/png;base64,${playbackApp.appIcon}`"
            :alt="`${playbackApp.application} icon`"
            width="32"
            style="object-fit: scale-down"
          />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="text-wrap">
            {{ getPrettyName(playbackApp) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-else>
      <v-row class="mx-5 mt-6" justify="center">
        <v-img src="@/assets/undraw_Taken_re_yn20.svg" width="232" contain></v-img>
      </v-row>
      <v-row class="mt-5" justify="center">
        <span>{{ $t('appPassThrough.noAppsFound') }}</span>
      </v-row>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { getPrettyName } from '@/utils';
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
    startPassthrough(app: Output): void {
      this.$store.dispatch('startPassthrough', app);
      this.appPassThroughDrawer = false;
    },
    keyDownHandler(event: KeyboardEvent): void {
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.code === 'KeyG') {
        event.preventDefault();
        this.appPassThroughDrawer = !this.appPassThroughDrawer;
      }
    },
    getPrettyName,
  },
});
</script>
