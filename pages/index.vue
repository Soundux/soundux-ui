<template>
  <v-container>
    <v-row>
      <v-col>
        <v-avatar color="primary" rounded size="64">
          <img src="icon.png" alt="Logo" />
        </v-avatar>
        <span class="headline">Soundux</span>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
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
        <v-btn color="primary" block :disabled="appsLoading" @click="refreshApps">
          <v-icon left dark :class="{ 'spin-infinite': appsLoading }">mdi-reload</v-icon>
          Refresh
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense no-gutters>
      <v-col cols="auto">
        <v-btn color="primary" x-large>
          <v-icon left dark>mdi-stop</v-icon>
          Stop
        </v-btn>
      </v-col>
      <v-col sm="5" md="6" xl="7" class="ml-5">
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
    </v-row>

    <v-row>
      <v-col v-if="tabs.length > 0">
        <v-tabs v-model="activeTabIndex">
          <draggable
            v-model="tabs"
            class="v-slide-group__wrapper"
            v-bind="{
              animation: 200,
              ghostClass: 'ghost',
            }"
            @start="startDrag"
            @end="stopDrag"
          >
            <v-tab v-for="(tab, index) in tabs" :key="index">
              {{ tab.title }}
              <v-icon right small color="grey" style="cursor: pointer" @click.stop="deleteTab(tab)">
                mdi-close-circle
              </v-icon>
            </v-tab>
          </draggable>
        </v-tabs>

        <v-tabs-items v-model="activeTabIndex">
          <v-tab-item v-for="(tab, index) in tabs" :key="index">
            <v-list>
              <v-list-item-group v-model="tab.selectedSoundIndex" color="primary">
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
      <v-col v-else>
        <v-card>
          <v-card-title>Welcome to Soundux</v-card-title>
          <v-card-text>
            There are currently no tabs. Add one by pressing
            <b>Add tab</b>
            on the right side

            <v-img src="undraw_empty_xct9.svg" height="150" contain></v-img>
          </v-card-text>
        </v-card>
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
          <v-icon left dark>mdi-folder-refresh-outline</v-icon>
          Reload sounds
        </v-btn>
        <v-spacer></v-spacer>
        <SetHotkeyModal :sound="activeSound"></SetHotkeyModal>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-play</v-icon>
          Play
        </v-btn>
        <SettingsModal></SettingsModal>
        <v-btn color="grey darken-3" block class="mb-2">
          <v-icon left dark>mdi-help-circle-outline</v-icon>
          Help
          <!-- TODO: help modal with key binds CTRL + F, double-click to play etc. -->
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import { App, Tab, Sound } from '~/types';

import SettingsModal from '~/components/SettingsModal.vue';
import SetHotkeyModal from '~/components/SetHotkeyModal.vue';
import SearchDrawer from '~/components/SearchDrawer.vue';

export default Vue.extend({
  components: { SearchDrawer, SetHotkeyModal, SettingsModal, draggable },
  data() {
    return {
      appsLoading: false,
      availableApps: [
        { name: 'Discord', icon: 'mdi-discord' },
        { name: 'Teams', icon: 'mdi-microsoft-teams' },
      ] as App[],
      selectedApp: null as App | null,
      syncVolume: true,
      activeTabIndex: 0,
      localVolume: 50,
      remoteVolume: 75,
      volume: 50,
      beforeDragActive: null as Tab | null,
      tabs: [
        {
          title: 'Tab 1',
          selectedSoundIndex: 0,
          sounds: [
            { name: 'Tab 1 Sound 1', path: 'Sound 1 Path' },
            { name: 'Tab 1 Sound 2', path: 'Sound 2 Path' },
            { name: 'Tab 1 Sound 3', path: 'Sound 3 Path' },
          ],
        },
        {
          title: 'Tab 2',
          selectedSoundIndex: 0,
          sounds: [
            { name: 'Tab 2 Sound 1', path: 'Sound 1 Path' },
            { name: 'Tab 2 Sound 2', path: 'Sound 2 Path' },
            { name: 'Tab 2 Sound 3', path: 'Sound 3 Path' },
          ],
        },
        {
          title: 'Tab 3',
          selectedSoundIndex: 0,
          sounds: [
            { name: 'Tab 3 Sound 1', path: 'Sound 1 Path' },
            { name: 'Tab 3 Sound 2', path: 'Sound 2 Path' },
            { name: 'Tab 3 Sound 3', path: 'Sound 3 Path' },
          ],
        },
        {
          title: 'Tab 4',
          selectedSoundIndex: 0,
          sounds: [
            { name: 'Tab 4 Sound 1', path: 'Sound 1 Path' },
            { name: 'Tab 4 Sound 2', path: 'Sound 2 Path' },
            { name: 'Tab 4 Sound 3', path: 'Sound 3 Path' },
          ],
        },
        {
          title: 'Tab 5',
          selectedSoundIndex: 0,
          sounds: [
            { name: 'Tab 5 Sound 1', path: 'Sound 1 Path' },
            { name: 'Tab 5 Sound 2', path: 'Sound 2 Path' },
            { name: 'Tab 5 Sound 3', path: 'Sound 3 Path' },
          ],
        },
      ] as Tab[],
    };
  },
  computed: {
    activeSound(): Sound | null {
      const tabs = this.tabs;
      if (tabs.length > 0) {
        const activeTabIndex = this.activeTabIndex;
        const tab = tabs[activeTabIndex];
        if (tab && tab.sounds.length > 0) {
          const selectedSoundIndex = tab.selectedSoundIndex;
          return tab.sounds[selectedSoundIndex];
        }
      }
      return null;
    },
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
    refreshApps(): void {
      this.appsLoading = true;
      window.setTimeout(() => {
        this.appsLoading = false;
      }, 1000);
    },
    deleteTab(tab: Tab) {
      const deleteIndex = this.tabs.indexOf(tab);
      this.tabs.splice(deleteIndex, 1);

      // when deleting a tab to the left of the active one, the active index must be decreased by one
      if (this.activeTabIndex > deleteIndex) {
        this.activeTabIndex--;
      }
    },
    startDrag(): void {
      // save for stopDrag
      this.beforeDragActive = this.tabs[this.activeTabIndex];
    },
    stopDrag(): void {
      // after dragging, the active tab index must be updated, as only the order in the tabs array is changed
      if (this.beforeDragActive) {
        this.activeTabIndex = this.tabs.indexOf(this.beforeDragActive);
      }
    },
  },
});
</script>

<style lang="scss">
// disallow selection of text (WebKit fix: https://stackoverflow.com/a/20495972)
*:not(input) {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

// spin animation for refresh icon
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spin-infinite {
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

// ghost class for vue draggable
.ghost {
  opacity: 0;
}

// we want our tabs to use the default cursor
.v-tab {
  cursor: default;
}
</style>
