<template>
  <v-container>
    <v-row>
      <v-col>
        <v-avatar color="primary" rounded size="64">
          <img src="icon.png" alt="Logo" />
        </v-avatar>
        <span class="headline">Soundux</span>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="selectedApp"
          :loading="appsLoading"
          :disabled="appsLoading"
          item-text="name"
          :items="availableApps"
          label="Output application"
          outlined
          messages="The application to play the sound to"
          dense
        >
          <template #selection="{ item }">
            <v-icon>{{ item.icon }}</v-icon> {{ item.name }}
          </template>
          <template #item="{ item }">
            <v-icon>{{ item.icon }}</v-icon> {{ item.name }}
          </template>
        </v-select>
        <v-btn color="primary" block @click="refreshApps">
          <v-icon left dark>mdi-reload</v-icon>
          Refresh
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense no-gutters>
      <v-col cols="1">
        <v-btn color="primary" x-large>
          <v-icon left dark>mdi-stop</v-icon>
          Stop
        </v-btn>
      </v-col>
      <v-col>
        <v-slider
          v-model="localVolume"
          messages="Local volume"
          :thumb-label="true"
          prepend-icon="mdi-volume-high"
        ></v-slider>
        <v-slider
          v-model="remoteVolume"
          messages="Remote volume"
          :thumb-label="true"
          prepend-icon="mdi-volume-high"
        ></v-slider>
      </v-col>
      <v-col cols="1" align-self="center">
        <v-checkbox v-model="syncVolume" :label="`Sync`"></v-checkbox>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-row>
      <v-col>
        <v-tabs v-model="activeTab">
          <v-tab v-for="(tab, index) in tabs" :key="index">
            {{ tab.title }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
          <v-tab-item v-for="(tab, index) in tabs" :key="index">
            <v-list>
              <v-list-item-group v-model="tab.selectedItem" color="primary">
                <v-list-item v-for="sound in tab.sounds" :key="sound.path">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ sound.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="2">
        <v-btn color="grey darken-3" block class="mb-2" @click="$store.commit('toggleSearchDrawer')">
          <v-icon left dark>mdi-magnify</v-icon>
          Search
        </v-btn>
        <SearchDrawer></SearchDrawer>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-folder-plus</v-icon>
          Add tab
        </v-btn>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-tab-minus</v-icon>
          Remove tab
        </v-btn>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-refresh</v-icon>
          Refresh
        </v-btn>
        <v-spacer></v-spacer>
        <SetHotkeyModal></SetHotkeyModal>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-play</v-icon>
          Play
        </v-btn>
        <SettingsModal></SettingsModal>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Tab, App } from '~/types';

import SettingsModal from '~/components/SettingsModal.vue';
import SetHotkeyModal from '~/components/SetHotkeyModal.vue';
import SearchDrawer from '~/components/SearchDrawer.vue';

export default Vue.extend({
  components: { SearchDrawer, SetHotkeyModal, SettingsModal },
  data() {
    return {
      appsLoading: false,
      availableApps: [
        { name: 'Discord', icon: 'mdi-discord' },
        { name: 'Teams', icon: 'mdi-microsoft-teams' },
      ] as App[],
      selectedApp: null,
      syncVolume: true,
      activeTab: null,
      localVolume: 50,
      remoteVolume: 75,
      volume: 50,
      tabs: [
        {
          title: 'Tab 1',
          selectedItem: null,
          sounds: [
            { name: 'Sound 1', path: 'Sound 1 Path' },
            { name: 'Sound 2', path: 'Sound 2 Path' },
            { name: 'Sound 3', path: 'Sound 3 Path' },
          ],
        },
        {
          title: 'Tab 2',
          selectedItem: null,
          sounds: [
            { name: 'Sound 1', path: 'Sound 1 Path' },
            { name: 'Sound 2', path: 'Sound 2 Path' },
            { name: 'Sound 3', path: 'Sound 3 Path' },
          ],
        },
        {
          title: 'Tab 3',
          selectedItem: null,
          sounds: [
            { name: 'Sound 1', path: 'Sound 1 Path' },
            { name: 'Sound 2', path: 'Sound 2 Path' },
            { name: 'Sound 3', path: 'Sound 3 Path' },
          ],
        },
        {
          title: 'Tab 4',
          selectedItem: null,
          sounds: [
            { name: 'Sound 1', path: 'Sound 1 Path' },
            { name: 'Sound 2', path: 'Sound 2 Path' },
            { name: 'Sound 3', path: 'Sound 3 Path' },
          ],
        },
        {
          title: 'Tab 5',
          selectedItem: null,
          sounds: [
            { name: 'Sound 1', path: 'Sound 1 Path' },
            { name: 'Sound 2', path: 'Sound 2 Path' },
            { name: 'Sound 3', path: 'Sound 3 Path' },
          ],
        },
      ] as Tab[],
    };
  },
  /* watch: {
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
  }, */
  methods: {
    refreshApps() {
      this.appsLoading = true;
      window.setTimeout(() => {
        this.appsLoading = false;
      }, 1000);
    },
  },
});
</script>

<style lang="scss">
// Webkit no input solution: https://stackoverflow.com/questions/20495827/text-field-not-working-in-safari/20495972
*:not(input, v-text-field, v-input) {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
</style>
