<template>
  <v-app dark>
    <AppPassthroughDrawer v-if="$store.getters.isLinux"></AppPassthroughDrawer>
    <v-main>
      <UpdateModal></UpdateModal>
      <SearchModal></SearchModal>
      <SetHotkeyModal></SetHotkeyModal>
      <SwitchOnConnectModal v-if="$store.getters.isLinux"></SwitchOnConnectModal>
      <v-container fluid>
        <v-row dense no-gutters class="flex-nowrap">
          <v-col cols="auto">
            <v-avatar tile size="64">
              <img src="./assets/icon.svg" alt="Logo" />
            </v-avatar>
            <span class="text-h5 ml-3">Soundux</span>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto" style="min-width: 200px; max-width: 250px">
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
        <v-row dense no-gutters class="flex-nowrap" align="center">
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
          <v-col sm="6" md="7" xl="8" class="ml-3">
            <VolumeSliders></VolumeSliders>
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
import { initialize } from '@/utils/backend';
import AppPassthroughDrawer from '@/components/drawers/AppPassthroughDrawer.vue';
import SwitchOnConnectModal from '@/components/modals/SwitchOnConnectModal.vue';
import PlayingSoundsDrawer from '@/components/drawers/PlayingSoundsDrawer.vue';
import OutputSelection from '@/components/OutputSelection.vue';
import SoundTabs from '@/components/SoundTabs.vue';
import NoTabsCard from '@/components/NoTabsCard.vue';
import UpdateModal from '@/components/modals/UpdateModal.vue';
import VolumeSliders from '@/components/VolumeSliders.vue';
import SideButtons from '@/components/SideButtons.vue';
import SetHotkeyModal from '@/components/modals/SetHotkeyModal.vue';
import SearchModal from '@/components/modals/SearchModal.vue';

export default Vue.extend({
  components: {
    SearchModal,
    SetHotkeyModal,
    SideButtons,
    VolumeSliders,
    NoTabsCard,
    SoundTabs,
    UpdateModal,
    OutputSelection,
    PlayingSoundsDrawer,
    SwitchOnConnectModal,
    AppPassthroughDrawer,
  },
  mounted() {
    initialize();
  },
});
</script>

<style lang="scss">
// hide scrollbar
html {
  overflow: hidden;
}
// disallow selection of text (WebKit fix: https://stackoverflow.com/a/20495972)
*:not(input, textarea) {
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

// make it a bit lighter
.v-divider {
  border-color: rgba(255, 255, 255, 0.3) !important;
}
</style>
