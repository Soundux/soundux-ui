<template>
  <div>
    <v-slider
      v-model="localVolume"
      dense
      hide-details
      :label="$t('volume.local')"
      thumb-label
      :class="{ 'no-animation': dragRemote }"
      prepend-icon="mdi-volume-high"
      @start="dragLocal = true"
      @end="dragLocal = false"
    ></v-slider>
    <v-slider
      v-model="remoteVolume"
      dense
      hide-details
      :label="$t('volume.remote')"
      :disabled="!$store.getters.selectedOutput && !$store.getters.settings.useAsDefaultDevice"
      thumb-label
      :class="{ 'no-animation': dragLocal }"
      prepend-icon="mdi-volume-high"
      @start="dragRemote = true"
      @end="dragRemote = false"
    ></v-slider>
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
    };
  },
  props: {
    syncVolume: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    localVolume: {
      get() {
        return this.$store.getters.settings.localVolume * 100;
      },
      set(volume: number) {
        this.$store.dispatch('setLocalVolume', volume);
      },
    },
    remoteVolume: {
      get() {
        return this.$store.getters.settings.remoteVolume * 100;
      },
      set(volume: number) {
        this.$store.dispatch('setRemoteVolume', volume);
      },
    },
  },
  watch: {
    localVolume(val: number) {
      if (this.syncVolume) {
        this.remoteVolume = val;
      }
    },
    remoteVolume(val: number) {
      if (this.syncVolume) {
        this.localVolume = val;
      }
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
