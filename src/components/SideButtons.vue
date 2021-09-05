<template>
  <div class="d-flex flex-column flex-nowrap fill-height">
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
      <template #activator="{ on, attrs }">
        <v-btn
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
          :disabled="!$store.getters.currentTab || $store.getters.showFavorites"
          class="mb-2"
          v-bind="attrs"
          v-on="on"
        >
          <template v-if="$store.getters.currentTab">
            <v-icon v-if="$store.getters.currentTab.sortMode === 0" left>
              mdi-sort-calendar-ascending
            </v-icon>
            <v-icon v-else-if="$store.getters.currentTab.sortMode === 1" left>
              mdi-sort-calendar-descending
            </v-icon>
            <v-icon v-else-if="$store.getters.currentTab.sortMode === 2" left>
              mdi-sort-alphabetical-ascending
            </v-icon>
            <v-icon v-else-if="$store.getters.currentTab.sortMode === 3" left>
              mdi-sort-alphabetical-descending
            </v-icon>
          </template>
          <v-icon v-else left>mdi-sort-calendar-descending</v-icon>
          {{ $t('sort.title') }}
        </v-btn>
      </template>
      <v-list v-if="$store.getters.currentTab">
        <v-list-item-group :value="$store.getters.currentTab.sortMode">
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
    <v-menu offset-y close-on-content-click>
      <template #activator="{ on, attrs }">
        <v-btn
          :color="
            $store.getters.playlistMode
              ? 'primary'
              : $vuetify.theme.dark
              ? 'grey darken-3'
              : 'grey lighten-1'
          "
          class="mb-2"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon v-if="$store.getters.playlistMode === 0" left>mdi-playlist-remove</v-icon>
          <v-icon v-else-if="$store.getters.playlistMode === 1" left>mdi-playlist-music</v-icon>
          <v-icon v-else-if="$store.getters.playlistMode === 2" left>mdi-shuffle</v-icon>
          {{ $t('actions.playlistMode') }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item-group :value="$store.getters.playlistMode">
          <v-list-item @click="$store.commit('setPlaylistMode', 0)">
            <v-list-item-title>
              <v-icon left>mdi-playlist-remove</v-icon>
              {{ $t('actions.off') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="$store.commit('setPlaylistMode', 1)">
            <v-list-item-title>
              <v-icon left>mdi-playlist-music</v-icon>
              {{ $t('actions.on') }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="$store.commit('setPlaylistMode', 2)">
            <v-list-item-title>
              <v-icon left>mdi-shuffle</v-icon>
              {{ $t('actions.shuffle') }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
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
