<template>
  <v-app dark>
    <AppPassthroughDrawer v-if="$store.getters.isLinux"></AppPassthroughDrawer>
    <v-main style="max-height: 100vh">
      <SwitchOnConnectModal v-if="$store.getters.isLinux"></SwitchOnConnectModal>
      <v-container fluid style="max-height: 100vh; overflow: hidden">
        <v-row class="flex-nowrap">
          <v-col>
            <v-avatar tile size="64">
              <img src="./assets/icon.svg" alt="Logo" />
            </v-avatar>
            <span class="text-h5 ml-3">Soundux</span>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2">
            <OutputSelection></OutputSelection>
            <v-btn
              color="primary"
              :disabled="
                $store.getters.settings.useAsDefaultDevice ||
                (!$store.getters.isLinux && $store.getters.currentPlaying.length > 0)
              "
              block
              class="mt-2"
              @click="$store.dispatch('getOutputs')"
            >
              <v-icon left dark>mdi-reload</v-icon>
              {{ $t('actions.refresh') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row dense no-gutters class="flex-nowrap">
          <v-col cols="auto">
            <v-btn
              color="primary"
              x-large
              block
              :disabled="$store.getters.currentPlaying.length === 0"
              @click="$store.dispatch('stopSounds')"
            >
              <v-icon left dark>mdi-stop</v-icon>
              {{ $t('actions.stop') }}
            </v-btn>
          </v-col>
          <v-col sm="5" md="6" xl="7" class="ml-5 mr-3">
            <VolumeSliders :sync-volume="syncVolume"></VolumeSliders>
          </v-col>
          <v-col cols="2" align-self="center">
            <v-checkbox v-model="syncVolume">
              <template #label>
                <v-icon left small>mdi-link</v-icon>
                {{ $t('volume.sync') }}
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
        <v-row dense class="flex-nowrap overflow-x-auto" align="stretch">
          <v-col class="flex-grow-1 flex-shrink-1" style="max-width: calc(100vw - 197px)">
            <SoundTabs v-if="$store.getters.tabs.length > 0"></SoundTabs>
            <NoTabsCard v-else></NoTabsCard>
          </v-col>
          <v-col cols="auto" align-self="stretch" style="width: 181px">
            <SideButtons></SideButtons>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <PlayingSoundsDrawer></PlayingSoundsDrawer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import AppPassthroughDrawer from '@/components/drawers/AppPassthroughDrawer.vue';
import SwitchOnConnectModal from '@/components/modals/SwitchOnConnectModal.vue';
import PlayingSoundsDrawer from '@/components/drawers/PlayingSoundsDrawer.vue';
import OutputSelection from '@/components/OutputSelection.vue';
import SoundTabs from '@/components/SoundTabs.vue';
import NoTabsCard from '@/components/NoTabsCard.vue';
import VolumeSliders from '@/components/VolumeSliders.vue';
import SideButtons from '@/components/SideButtons.vue';

export default Vue.extend({
  components: {
    SideButtons,
    VolumeSliders,
    NoTabsCard,
    SoundTabs,
    OutputSelection,
    PlayingSoundsDrawer,
    SwitchOnConnectModal,
    AppPassthroughDrawer,
  },
  data() {
    return {
      syncVolume: false,
    };
  },
  mounted() {
    // initial data loading
    this.$store.dispatch('getIsLinux');
    // data has to be loaded here since SoundTabs is only mounted when there are tabs
    this.$store.dispatch('getData');

    // register functions for the backend to call
    // @ts-ignore
    window.onError = error => {
      this.$toast.error(`${this.$t('errors.error')}: ${this.$t('errors.' + error)}`);
    };
  },
});
</script>

<style lang="scss">
// hide scrollbar
html {
  overflow: hidden;
}
// disallow selection of text (WebKit fix: https://stackoverflow.com/a/20495972)
*:not(input) {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
// disables dragging images
img {
  pointer-events: none;
}

// fix a bug where the input wraps
.v-select__selections input {
  display: none;
}
</style>
