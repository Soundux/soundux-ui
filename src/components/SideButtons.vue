<template>
  <div class="d-flex flex-column flex-nowrap align-stretch fill-height">
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      class="mb-2"
      @click="$store.dispatch('addTab')"
    >
      <v-icon left dark>mdi-folder-plus</v-icon>
      {{ $t('actions.addTab') }}
    </v-btn>
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      class="mb-2"
      :disabled="$store.getters.tabs.length === 0"
      @click="$store.dispatch('refreshTab')"
    >
      <v-icon left dark>mdi-folder-refresh-outline</v-icon>
      {{ $t('actions.reloadSounds') }}
    </v-btn>
    <DownloaderModal></DownloaderModal>
    <v-btn
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      class="mb-2"
      @click="$store.commit('setSearchModal', true)"
    >
      <v-icon left dark>mdi-magnify</v-icon>
      {{ $t('actions.search') }}
    </v-btn>
    <v-menu offset-y close-on-content-click>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
          class="mb-2"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon v-if="$store.getters.settings.sortMode === 0" left>mdi-sort-calendar-ascending</v-icon>
          <v-icon v-else-if="$store.getters.settings.sortMode === 1" left>
            mdi-sort-calendar-descending
          </v-icon>
          <v-icon v-else-if="$store.getters.settings.sortMode === 2" left>
            mdi-sort-alphabetical-ascending
          </v-icon>
          <v-icon v-else-if="$store.getters.settings.sortMode === 3" left>
            mdi-sort-alphabetical-descending
          </v-icon>
          {{ $t('sort.title') }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item-group :value="$store.getters.settings.sortMode">
          <v-list-item @click="$store.dispatch('setSortMode', 0)">
            <v-list-item-title>
              <v-icon left>mdi-sort-calendar-ascending</v-icon>
              {{ $t('sort.modifiedAscending') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="$store.dispatch('setSortMode', 1)">
            <v-list-item-title>
              <v-icon left>mdi-sort-calendar-descending</v-icon>
              {{ $t('sort.modifiedDescending') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="$store.dispatch('setSortMode', 2)">
            <v-list-item-title>
              <v-icon left>mdi-sort-alphabetical-ascending</v-icon>
              {{ $t('sort.alphabeticalAscending') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="$store.dispatch('setSortMode', 3)">
            <v-list-item-title>
              <v-icon left>mdi-sort-alphabetical-descending</v-icon>
              {{ $t('sort.alphabeticalDescending') }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
    <v-btn
      :color="
        $store.getters.showFavorites
          ? 'primary'
          : $vuetify.theme.dark
          ? 'grey darken-3'
          : 'grey lighten-1'
      "
      class="mb-2"
      @click="$store.commit('setShowFavorites', !$store.getters.showFavorites)"
    >
      <v-icon left>mdi-heart</v-icon>
      {{ $t('favorites.title') }}
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn
      v-if="$store.getters.isLinux"
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
      class="mb-2"
      @click="$store.commit('setAppPassThroughDrawer', true)"
    >
      <v-icon left dark>mdi-cable-data</v-icon>
      {{ $t('actions.appPassThrough') }}
    </v-btn>
    <SettingsModal></SettingsModal>
    <SystemInfoModal></SystemInfoModal>
    <HelpModal></HelpModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SettingsModal from '@/components/modals/SettingsModal.vue';
import HelpModal from '@/components/modals/HelpModal.vue';
import DownloaderModal from '@/components/modals/DownloaderModal.vue';
import SystemInfoModal from '@/components/modals/SystemInfoModal.vue';

export default Vue.extend({
  name: 'SideButtons',
  components: {
    SystemInfoModal,
    DownloaderModal,
    HelpModal,
    SettingsModal,
  },
});
</script>
