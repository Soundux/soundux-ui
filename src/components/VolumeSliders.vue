<template>
  <div>
    <v-row no-gutters align="center" class="flex-nowrap ml-3 mb-n2">
      <v-divider vertical style="clip-path: inset(50% 0% 0% 0%)"></v-divider>
      <v-col cols="auto" class="mr-1">
        <v-divider style="width: 15px"></v-divider>
      </v-col>
      <v-col cols="auto">
        <v-icon left v-text="volumeIcon(localVolume)"></v-icon>
      </v-col>
      <v-col cols="auto" class="text-truncate text--secondary hidden-xs-only" style="flex-basis: 115px">
        {{ $t('volume.local') }}
      </v-col>
      <v-col>
        <v-slider
          v-model="localVolume"
          dense
          hide-details
          :thumb-label="$vuetify.breakpoint.smAndUp"
          :class="{ 'no-animation': dragRemote }"
          @start="dragLocal = true"
          @end="dragLocal = false"
        ></v-slider>
      </v-col>
    </v-row>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon
          v-text="syncVolumes ? 'mdi-link' : 'mdi-link-off'"
          v-bind="attrs"
          v-on="on"
          @click="syncVolumes = !syncVolumes"
        ></v-icon>
      </template>
      <span>{{ $t('volume.sync') }}</span>
    </v-tooltip>

    <v-row no-gutters align="center" class="flex-nowrap ml-3 mt-n2">
      <v-divider vertical style="clip-path: inset(0% 0% 50% 0%)"></v-divider>
      <v-col cols="auto" class="mr-1">
        <v-divider style="width: 15px"></v-divider>
      </v-col>
      <v-col cols="auto">
        <v-icon left v-text="volumeIcon(remoteVolume)"></v-icon>
      </v-col>
      <v-col cols="auto" class="text-truncate text--secondary hidden-xs-only" style="flex-basis: 115px">
        {{ $t('volume.remote') }}
      </v-col>
      <v-col>
        <v-slider
          v-model="remoteVolume"
          dense
          hide-details
          :disabled="!$store.getters.selectedOutput && !$store.getters.settings.useAsDefaultDevice"
          :thumb-label="$vuetify.breakpoint.smAndUp"
          :class="{ 'no-animation': dragLocal }"
          @start="dragRemote = true"
          @end="dragRemote = false"
        ></v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'VolumeSliders',
  data() {
    return {
      dragLocal: false,
      dragRemote: false,
      wasRemoteLastUpdated: false,
    };
  },
  computed: {
    localVolume: {
      get(): number {
        return this.$store.getters.settings.localVolume * 100;
      },
      set(volume: number) {
        this.$store.dispatch('setLocalVolume', volume);
        this.wasRemoteLastUpdated = false;
      },
    },
    remoteVolume: {
      get(): number {
        return this.$store.getters.settings.remoteVolume * 100;
      },
      set(volume: number) {
        this.$store.dispatch('setRemoteVolume', volume);
        this.wasRemoteLastUpdated = true;
      },
    },
    syncVolumes: {
      get(): boolean {
        return this.$store.getters.settings.syncVolumes;
      },
      set(value: boolean) {
        this.$store.commit('setSyncVolumes', value);
        this.$store.dispatch('saveSettings');
        if (value) {
          if (this.wasRemoteLastUpdated) {
            this.localVolume = this.remoteVolume;
          } else {
            this.remoteVolume = this.localVolume;
          }
        }
      },
    },
  },
  watch: {
    localVolume(val: number) {
      if (this.syncVolumes) {
        this.remoteVolume = val;
      }
    },
    remoteVolume(val: number) {
      if (this.syncVolumes) {
        this.localVolume = val;
      }
    },
  },
  methods: {
    volumeIcon(volume: number): string {
      if (volume > 80) {
        return 'mdi-volume-high';
      } else if (volume > 30) {
        return 'mdi-volume-medium';
      } else if (volume > 0) {
        return 'mdi-volume-low';
      }
      return 'mdi-volume-off';
    },
  },
});
</script>

<style lang="scss">
// class to disable animation needed for sync volume dragging to be smooth
.no-animation * * {
  transition: none !important;
}
</style>
