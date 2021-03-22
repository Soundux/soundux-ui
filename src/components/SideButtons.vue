<template>
  <div class="d-flex flex-column flex-nowrap align-stretch fill-height">
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      class="mb-2"
      :disabled="!$store.getters.activeSound"
      @click="$store.dispatch('playSound')"
    >
      <v-icon left dark>mdi-play</v-icon>
      {{ $t('actions.play') }}
    </v-btn>
    <SetHotkeyModal></SetHotkeyModal>
    <v-btn
      v-if="$store.getters.isLinux"
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      class="mb-2"
      @click="$store.commit('setAppPassThroughDrawer', true)"
    >
      <v-icon left dark>mdi-cable-data</v-icon>
      {{ $t('actions.appPassThrough') }}
    </v-btn>
    <SearchModal></SearchModal>
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      class="mb-2"
      @click="$store.dispatch('addTab')"
    >
      <v-icon left dark>mdi-folder-plus</v-icon>
      {{ $t('actions.addTab') }}
    </v-btn>
    <v-spacer></v-spacer>
    <DownloaderModal></DownloaderModal>
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      class="mb-2"
      :disabled="$store.getters.tabs.length === 0"
      @click="$store.dispatch('refreshTab')"
    >
      <v-icon left dark>mdi-folder-refresh-outline</v-icon>
      {{ $t('actions.reloadSounds') }}
    </v-btn>
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      class="mb-2"
      @click="$store.commit('setSearchModal', true)"
    >
      <v-icon left dark>mdi-magnify</v-icon>
      {{ $t('actions.search') }}
    </v-btn>
    <SettingsModal></SettingsModal>
    <SystemInfoModal></SystemInfoModal>
    <HelpModal></HelpModal>
  </div>
</template>

<script>
import SettingsModal from '@/components/modals/SettingsModal';
import HelpModal from '@/components/modals/HelpModal';
import SetHotkeyModal from '@/components/modals/SetHotkeyModal';
import SearchModal from '@/components/modals/SearchModal';
import DownloaderModal from '@/components/modals/DownloaderModal';
import SystemInfoModal from '@/components/modals/SystemInfoModal';
export default {
  name: 'SideButtons',
  components: {
    SystemInfoModal,
    DownloaderModal,
    SearchModal,
    SetHotkeyModal,
    HelpModal,
    SettingsModal,
  },
};
</script>
