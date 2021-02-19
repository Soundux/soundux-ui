<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-avatar tile size="64">
          <img src="icon.svg" alt="Logo" />
        </v-avatar>
        <span class="text-h5">Soundux</span>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-select
          v-model="selectedAppIndex"
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
        <v-btn color="primary" x-large block @click="$store.dispatch('stopSounds')">
          <v-icon left dark>mdi-stop</v-icon>
          Stop
        </v-btn>
      </v-col>
      <v-col sm="5" md="6" xl="7" class="ml-5 mr-3">
        <v-slider
          v-model="localVolume"
          dense
          hide-details
          label="Local volume"
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
          label="Remote volume"
          thumb-label
          :class="{ 'no-animation': dragLocal }"
          prepend-icon="mdi-volume-high"
          @start="dragRemote = true"
          @end="dragRemote = false"
        ></v-slider>
      </v-col>
      <v-col cols="2" align-self="center">
        <v-checkbox v-model="syncVolume">
          <template #label>
            <v-icon left small>mdi-link</v-icon>
            Sync volumes
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-if="$store.getters.tabs.length > 0">
        <v-tabs v-model="mutableActiveTabIndex">
          <draggable
            v-model="mutableTabs"
            class="v-slide-group__wrapper"
            v-bind="{
              animation: 200,
              ghostClass: 'ghost',
            }"
            @start="startDrag"
            @end="stopDrag"
          >
            <v-tab v-for="(tab, index) in $store.getters.tabs" :key="index">
              {{ tab.name }}
              <v-icon
                right
                small
                color="grey"
                style="cursor: pointer"
                @click.stop="$store.dispatch('deleteTab', tab)"
              >
                mdi-close-circle
              </v-icon>
            </v-tab>
          </draggable>
        </v-tabs>

        <v-tabs-items v-model="$store.getters.activeTabIndex">
          <v-tab-item v-for="(tab, index) in $store.getters.tabs" :key="index">
            <v-list>
              <v-list-item-group
                :value="tab.selectedSoundIndex"
                color="primary"
                @change="$store.commit('setSelectedSoundIndex', { tabId: tab.id, index: $event })"
              >
                <v-list-item v-for="sound in tab.sounds" :key="sound.id">
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
      <v-col cols="auto" align-self="start">
        <v-btn
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
          block
          class="mb-2"
          @click="$store.commit('toggleSearchDrawer')"
        >
          <v-icon left dark>mdi-magnify</v-icon>
          Search
        </v-btn>
        <SearchDrawer></SearchDrawer>
        <v-btn
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
          block
          class="mb-2"
          @click="$store.dispatch('addTab')"
        >
          <v-icon left dark>mdi-folder-plus</v-icon>
          Add tab
        </v-btn>
        <v-btn
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
          block
          class="mb-2"
          :disabled="$store.getters.tabs.length === 0"
          @click="$store.dispatch('refreshTab')"
        >
          <v-icon left dark>mdi-folder-refresh-outline</v-icon>
          Reload sounds
        </v-btn>
        <v-spacer></v-spacer>
        <SetHotkeyModal :sound="$store.getters.activeSound"></SetHotkeyModal>
        <v-btn
          :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-1'"
          block
          class="mb-2"
          :disabled="!$store.getters.activeSound"
          @click="$store.dispatch('playSound')"
        >
          <v-icon left dark>mdi-play</v-icon>
          Play
        </v-btn>
        <SettingsModal></SettingsModal>
        <HelpModal></HelpModal>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import { App, PlayingSound, Tab } from '~/types';

import SettingsModal from '~/components/SettingsModal.vue';
import HelpModal from '~/components/HelpModal.vue';
import SetHotkeyModal from '~/components/SetHotkeyModal.vue';
import SearchDrawer from '~/components/SearchDrawer.vue';

export default Vue.extend({
  components: { SearchDrawer, SetHotkeyModal, SettingsModal, HelpModal, draggable },
  data() {
    return {
      appsLoading: false,
      availableApps: [
        { name: 'Discord', icon: 'mdi-discord' },
        { name: 'Teams', icon: 'mdi-microsoft-teams' },
      ] as App[],
      selectedAppIndex: 0,
      syncVolume: true,
      localVolume: 50,
      remoteVolume: 75,
      volume: 50,
      beforeDragActive: null as Tab | null,
      dragLocal: false,
      dragRemote: false,
    };
  },
  computed: {
    mutableTabs: {
      get() {
        return this.$store.getters.tabs;
      },
      set(tabs: Tab[]) {
        this.$store.commit('setTabs', tabs);
      },
    },
    mutableActiveTabIndex: {
      get() {
        return this.$store.getters.activeTabIndex;
      },
      set(newIndex: number) {
        this.$store.commit('setActiveTabIndex', newIndex);
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
  mounted() {
    this.$store.dispatch('getData');
    // @ts-ignore
    window.updateSound = (playingSound: PlayingSound) => {
      const sound = this.$store.getters.currentPlaying.find(
        (x: PlayingSound) => x.id === playingSound.id
      );
      sound.readInMs = playingSound.readInMs;
    };
    // @ts-ignore
    window.finishSound = (playingSound: PlayingSound) => {
      this.$store.commit('removeFromCurrentlyPlaying', playingSound);
    };
  },
  methods: {
    refreshApps(): void {
      this.appsLoading = true;
      window.setTimeout(() => {
        this.appsLoading = false;
      }, 1000);
    },
    startDrag(): void {
      // save for stopDrag
      this.beforeDragActive = this.$store.getters.tabs[this.$store.getters.activeTabIndex];
    },
    stopDrag(): void {
      // after dragging, the active tab index must be updated, as only the order in the tabs array is changed
      if (this.beforeDragActive) {
        this.$store.commit('setActiveTabIndex', this.$store.getters.tabs.indexOf(this.beforeDragActive));
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

.no-animation * * {
  transition: none !important;
}
</style>
