<template>
  <div>
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      block
      class="mb-2"
      @click="$store.commit('toggleSearchDrawer')"
    >
      <v-icon left dark>mdi-magnify</v-icon>
      {{ $t('actions.search') }}
    </v-btn>
    <SearchDrawer></SearchDrawer>
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      block
      class="mb-2"
      @click="$store.dispatch('addTab')"
    >
      <v-icon left dark>mdi-folder-plus</v-icon>
      {{ $t('actions.addTab') }}
    </v-btn>
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      block
      class="mb-2"
      :disabled="$store.getters.tabs.length === 0"
      @click="$store.dispatch('refreshTab')"
    >
      <v-icon left dark>mdi-folder-refresh-outline</v-icon>
      {{ $t('actions.reloadSounds') }}
    </v-btn>
    <v-spacer></v-spacer>
    <SetHotkeyModal></SetHotkeyModal>
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      block
      class="mb-2"
      :disabled="!$store.getters.activeSound || !$store.getters.selectedOutput"
      @click="$store.dispatch('playSound')"
    >
      <v-icon left dark>mdi-play</v-icon>
      {{ $t('actions.play') }}
    </v-btn>
    <SettingsModal></SettingsModal>
    <HelpModal></HelpModal>
  </div>
</template>

<script>
import SettingsModal from '@/components/modals/SettingsModal';
import HelpModal from '@/components/modals/HelpModal';
import SetHotkeyModal from '@/components/modals/SetHotkeyModal';
import SearchDrawer from '@/components/drawers/SearchDrawer';
export default {
  name: 'SideButtons',
  components: { SearchDrawer, SetHotkeyModal, HelpModal, SettingsModal },
};
</script>
