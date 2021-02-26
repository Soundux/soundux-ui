<template>
  <v-container fluid>
    <AppPassthroughDrawer></AppPassthroughDrawer>
    <PlayingSoundsDrawer></PlayingSoundsDrawer>
    <SwitchOnConnectModal></SwitchOnConnectModal>
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
          v-model="selectedOutput"
          return-object
          :disabled="$store.getters.currentPlaying.length > 0"
          item-text="name"
          :items="this.$store.getters.outputs"
          :label="$t('outputApp.title')"
          outlined
          :messages="$t('outputApp.info')"
          dense
        >
          <!--<template #selection="{ item }">
            <v-icon>{{ item.icon }}</v-icon> {{ item.name }}
          </template>-->
          <!--<template #item="{ item }">
            <v-icon>{{ item.icon }}</v-icon> {{ item.name }}
          </template>-->
        </v-select>
        <v-btn color="primary" block @click="$store.dispatch('getOutputs')">
          <v-icon left dark>mdi-reload</v-icon>
          {{ $t('actions.refresh') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense no-gutters>
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
            {{ $t('volume.sync') }}
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

        <v-tabs-items :value="$store.getters.activeTabIndex">
          <v-tab-item v-for="(tab, index) in $store.getters.tabs" :key="index">
            <div v-if="$store.getters.settings.gridView" class="overflow-y-auto" style="height: 380px">
              <v-row id="grid-view" no-gutters>
                <template v-for="(sound, sIndex) in tab.sounds">
                  <v-col :key="sIndex" class="ma-2">
                    <v-btn
                      :id="`sound-${sound.id}`"
                      class="pa-2 text-none"
                      :class="tab.selectedSoundIndex === sIndex ? 'primaryIndicator' : ''"
                      block
                      height="50"
                      @click="$store.commit('setSelectedSoundIndex', { tabId: tab.id, index: sIndex })"
                    >
                      {{ sound.name }}
                    </v-btn>
                  </v-col>
                </template>
              </v-row>
            </div>
            <v-list v-else id="list-view" :height="380" class="overflow-y-auto">
              <v-list-item-group
                :value="tab.selectedSoundIndex"
                color="primary"
                @change="$store.commit('setSelectedSoundIndex', { tabId: tab.id, index: $event })"
              >
                <v-list-item v-for="sound in tab.sounds" :id="`sound-${sound.id}`" :key="sound.id">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ sound.name }}
                    </v-list-item-title>
                    <v-list-item-action-text>
                      {{ sound.hotkeySequence }}
                    </v-list-item-action-text>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col v-else>
        <v-card>
          <v-card-title>{{ $t('welcome.title', { programName: 'Soundux' }) }}</v-card-title>
          <v-card-text>
            <i18n path="welcome.noTabs">
              <b slot="addTab">{{ $t('actions.addTab') }}</b>
            </i18n>

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
        <SetHotkeyModal :sound="$store.getters.activeSound"></SetHotkeyModal>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import { Output, PlayingSound, Tab } from '~/types';

import SettingsModal from '~/components/SettingsModal.vue';
import HelpModal from '~/components/HelpModal.vue';
import SetHotkeyModal from '~/components/SetHotkeyModal.vue';
import SearchDrawer from '~/components/SearchDrawer.vue';
import AppPassthroughDrawer from '~/components/AppPassthroughDrawer.vue';
import SwitchOnConnectModal from '~/components/SwitchOnConnectModal.vue';
import PlayingSoundsDrawer from '~/components/PlayingSoundsDrawer.vue';

export default Vue.extend({
  components: {
    PlayingSoundsDrawer,
    SwitchOnConnectModal,
    AppPassthroughDrawer,
    SearchDrawer,
    SetHotkeyModal,
    SettingsModal,
    HelpModal,
    draggable,
  },
  data() {
    return {
      syncVolume: false,
      volume: 50,
      beforeDragActive: null as Tab | null,
      dragLocal: false,
      dragRemote: false,
    };
  },
  computed: {
    selectedOutput: {
      get() {
        return this.$store.getters.selectedOutput;
      },
      set(output: Output) {
        this.$store.dispatch('setSelectedOutput', output);
      },
    },
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
        this.$store.dispatch('setActiveTabIndex', newIndex);
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
    // initial data loading TODO: move this to an extra component?
    this.$store.dispatch('getData');
    this.$store.dispatch('getOutputs');
    this.$store.dispatch('isSwitchOnConnectLoaded');
    // @ts-ignore
    window.updateSound = (playingSound: PlayingSound) => {
      const sound = this.$store.getters.currentPlayingSounds.find(
        (x: PlayingSound) => x.id === playingSound.id
      );
      if (sound) {
        this.$store.commit('updateSound', { playing: sound, ms: playingSound.readInMs });
      } else {
        console.warn('Could not find sound for playingSound with id', playingSound.id);
      }
    };
    // @ts-ignore
    window.finishSound = (playingSound: PlayingSound) => {
      this.$store.commit('removeFromCurrentlyPlaying', playingSound);
    };
    // @ts-ignore
    window.onSoundPlayed = (playingSound: PlayingSound) => {
      if (playingSound) {
        this.$store.commit('addToCurrentlyPlaying', playingSound);
      }
    };
  },
  methods: {
    startDrag(): void {
      // save for stopDrag
      this.beforeDragActive = this.$store.getters.tabs[this.$store.getters.activeTabIndex];
    },
    stopDrag(): void {
      // after dragging, the active tab index must be updated, as only the order in the tabs array is changed
      if (this.beforeDragActive) {
        this.$store.dispatch(
          'setActiveTabIndex',
          this.$store.getters.tabs.indexOf(this.beforeDragActive)
        );
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

// ghost class for vue draggable
.ghost {
  opacity: 0;
}

// we want our tabs to use the default cursor
.v-tab {
  cursor: default !important;
}

.primaryIndicator::after {
  content: '\a0';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  border-top: 5px solid var(--v-primary-base);
  box-shadow: none !important;
  border-radius: 4px;
}

.no-animation * * {
  transition: none !important;
}
</style>
