import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from '@/plugins/vuetify';
import {
  Output,
  Playing,
  PlayingSound,
  Settings,
  SortMode,
  Sound,
  Tab,
  Theme,
  UpdateData,
  ViewMode,
} from '@/types';
import { sortTab } from '@/utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchModal: false,
    systemInfoModal: false,
    setHotkeyModal: false,
    removeTabModal: false,
    tabToRemove: null as Tab | null,
    deleteSoundModal: false,
    soundToDelete: null as Sound | null,
    setHotkeySound: null as Sound | null,
    appPassThroughDrawer: false,
    tabs: [] as Tab[],
    favorites: [] as number[],
    showFavorites: false,
    outputs: [] as Output[],
    selectedOutput: null as Output | null,
    playbackApps: [] as Output[],
    currentPlaying: [] as Playing[],
    switchOnConnectLoaded: false,
    isLinux: false,
    updateData: null as UpdateData | null,
    isDraggingSeekbar: false,
    settings: {
      output: '',
      selectedTab: 0,
      allowOverlapping: true,
      deleteToTrash: true,
      syncVolumes: false,
      theme: Theme.System,
      viewMode: ViewMode.List,
      stopHotkey: [] as number[],
      pushToTalkKeys: [] as number[],
      sortMode: SortMode.ModifiedDate_Descending,
      tabHotkeysOnly: false,
      minimizeToTray: false,
      localVolume: 0,
      remoteVolume: 0,
      useAsDefaultDevice: false,
      muteDuringPlayback: false,
    } as Settings,
  },
  getters: {
    searchModal: state => state.searchModal,
    setHotkeyModal: state => state.setHotkeyModal,
    setHotkeySound: state => state.setHotkeySound,
    systemInfoModal: state => state.systemInfoModal,
    removeTabModal: state => state.removeTabModal,
    tabToRemove: state => state.tabToRemove,
    deleteSoundModal: state => state.deleteSoundModal,
    soundToDelete: state => state.soundToDelete,
    appPassThroughDrawer: state => state.appPassThroughDrawer,
    tabs: state => state.tabs,
    currentTab: state => state.tabs[state.settings.selectedTab],
    favoritesTab: state => {
      const sounds = state.tabs
        .map(({ sounds }) => sounds)
        .reduce((acc, e) => acc.concat(e), [])
        .filter(({ id }) => state.favorites.includes(id));
      const tab: Tab = { id: -1, name: 'Favorites', sounds };
      sortTab(tab, state.settings.sortMode);
      return tab;
    },
    showFavorites: state => state.showFavorites,
    activeTabIndex: state => state.settings.selectedTab,
    outputs: state => state.outputs,
    selectedOutput: state => state.selectedOutput,
    playbackApps: state => state.playbackApps,
    currentPlaying: state => state.currentPlaying,
    currentPlayingSounds: state => {
      return state.currentPlaying.filter((x: Playing) => {
        return 'lengthInMs' in x;
      });
    },
    settings: state => state.settings,
    switchOnConnectLoaded: state => state.switchOnConnectLoaded,
    allSounds: state => {
      return state.tabs.map(({ sounds }) => sounds).reduce((acc, e) => acc.concat(e), []);
    },
    isLinux: state => state.isLinux,
    isDraggingSeekbar: state => state.isDraggingSeekbar,
    updateData: state => state.updateData,
  },
  mutations: {
    setSearchModal: (state, newState: boolean) => {
      if (!state.appPassThroughDrawer) {
        state.searchModal = newState;
      }
    },
    setSetHotkeyModal: (state, newState: boolean) => {
      state.setHotkeyModal = newState;
      if (!newState) {
        state.setHotkeySound = null;
      }
    },
    setSetHotkeySound: (state, sound: Sound | null) => {
      state.setHotkeySound = sound;
      // show modal when sound is present
      state.setHotkeyModal = !!sound;
    },
    setSystemInfoModal: (state, newState: boolean) => (state.systemInfoModal = newState),
    setRemoveTabModal: (state, newState: boolean) => (state.removeTabModal = newState),
    setTabToRemove: (state, tab: Tab | null) => {
      state.tabToRemove = tab;
      // show modal when tab is present
      state.removeTabModal = !!tab;
    },
    setDeleteSoundModal: (state, newState: boolean) => (state.deleteSoundModal = newState),
    setSoundToDelete: (state, sound: Sound | null) => {
      state.soundToDelete = sound;
      // show modal when sound is present
      state.deleteSoundModal = !!sound;
    },
    setAppPassThroughDrawer: (state, newState: boolean) => {
      if (!state.searchModal) {
        state.appPassThroughDrawer = newState;
      }
    },
    addTab: (state, tab: Tab) => state.tabs.push(tab),
    setTabs: (state, tabs: Tab[]) => (state.tabs = tabs),
    setShowFavorites: (state, newState: boolean) => (state.showFavorites = newState),
    setTabSounds: (_state, { tab, sounds }: { tab: Tab; sounds: Sound[] }) => (tab.sounds = sounds),
    setActiveTabIndex: (state, index: number) => (state.settings.selectedTab = index),
    setOutputs: (state, outputs: Output[]) => (state.outputs = outputs),
    setPlaybackApps: (state, playbackApps: Output[]) => (state.playbackApps = playbackApps),
    setSelectedOutput: (state, selectedOutput: Output | null) => {
      state.selectedOutput = selectedOutput;
      state.settings.output = selectedOutput ? selectedOutput.name : '';
    },
    updateSound: (
      _state,
      {
        playing,
        ms,
        paused,
        repeat,
      }: { playing: PlayingSound; ms?: number; paused?: boolean; repeat?: boolean }
    ) => {
      if (ms !== undefined) {
        playing.readInMs = ms;
      }
      if (paused !== undefined) {
        playing.paused = paused;
      }
      if (repeat !== undefined) {
        playing.repeat = repeat;
      }
    },
    toggleFavorite: (state, sound: Sound) => {
      const inTabs = state.tabs
        .map(({ sounds }) => sounds)
        .reduce((acc, e) => acc.concat(e), [])
        .find(({ id }) => id === sound.id);
      if (inTabs) {
        inTabs.isFavorite = !inTabs.isFavorite;
      }
    },
    setFavorites: (state, favorites: number[]) => {
      state.favorites = favorites;
    },
    addToCurrentlyPlaying: (state, playing: Playing) => state.currentPlaying.push(playing),
    clearCurrentlyPlaying: state => (state.currentPlaying = []),
    removePassthroughFromCurrentlyPlaying: state => {
      state.currentPlaying.forEach((playing: Playing) => {
        if ('name' in playing) {
          state.currentPlaying.splice(state.currentPlaying.indexOf(playing), 1);
        }
      });
    },
    removeFromCurrentlyPlaying: (state, playing: Playing) => {
      // search by id because object could be different (f.e. when the data comes from the backend)
      const realSound = state.currentPlaying.find(x => {
        if ('lengthInMs' in x && 'lengthInMs' in playing) {
          return x.id === playing.id;
        } else if ('name' in x && 'name' in playing) {
          return x.name === playing.name;
        }
        return false;
      });
      if (realSound) {
        state.currentPlaying.splice(state.currentPlaying.indexOf(realSound), 1);
      }
    },
    deleteSound: (state, sound: Sound) => {
      state.tabs.forEach(tab => tab.sounds.splice(tab.sounds.indexOf(sound), 1));
    },
    setSettings: (state, value: Settings) => {
      state.settings = value;
      switch (value.theme) {
        case Theme.System:
          Vuetify.framework.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          break;
        case Theme.Dark:
          Vuetify.framework.theme.dark = true;
          break;
        case Theme.Light:
          Vuetify.framework.theme.dark = false;
          break;
      }
    },
    setLocalVolume: (state, volume: number) => (state.settings.localVolume = volume),
    setRemoteVolume: (state, volume: number) => (state.settings.remoteVolume = volume),
    setTabHotkeysOnly: (state, value: boolean) => (state.settings.tabHotkeysOnly = value),
    setViewMode: (state, value: ViewMode) => (state.settings.viewMode = value),
    setAllowOverlapping: (state, value: boolean) => (state.settings.allowOverlapping = value),
    setDeleteToTrash: (state, value: boolean) => (state.settings.deleteToTrash = value),
    setSyncVolumes: (state, value: boolean) => (state.settings.syncVolumes = value),
    setMinimizeToTray: (state, value: boolean) => (state.settings.minimizeToTray = value),
    setUseAsDefaultDevice: (state, value: boolean) => (state.settings.useAsDefaultDevice = value),
    setMuteDuringPlayback: (state, value: boolean) => (state.settings.muteDuringPlayback = value),
    setSortMode: (state, sortMode: SortMode) => {
      state.settings.sortMode = sortMode;
      state.tabs.forEach((tab: Tab) => {
        sortTab(tab, sortMode);
      });
    },
    setStopHotkey: (state, value: number[]) => (state.settings.stopHotkey = value),
    setPushToTalkKeys: (state, value: number[]) => (state.settings.pushToTalkKeys = value),
    setIsLinux: (state, value: boolean) => (state.isLinux = value),
    setIsDraggingSeekbar: (state, value: boolean) => (state.isDraggingSeekbar = value),
    setTheme: (state, value: Theme) => {
      state.settings.theme = value;
      switch (value) {
        case Theme.System:
          Vuetify.framework.theme.dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          break;
        case Theme.Dark:
          Vuetify.framework.theme.dark = true;
          break;
        case Theme.Light:
          Vuetify.framework.theme.dark = false;
          break;
      }
    },
    setUpdateData: (state, value: UpdateData) => (state.updateData = value),
    setSwitchOnConnectLoaded: (state, loaded: boolean) => (state.switchOnConnectLoaded = loaded),
    setHotkeys: (_state, { sound, hotkeys }: { sound: Sound; hotkeys: number[] }) =>
      (sound.hotkeys = hotkeys),
    setHotkeySequence: (_state, { sound, hotkeySequence }: { sound: Sound; hotkeySequence: string }) =>
      (sound.hotkeySequence = hotkeySequence),
  },
  actions: {
    /**
     * Fetch the tabs from the backend
     */
    async getTabs({ commit, getters }) {
      const tabs = await window.getTabs();
      if (tabs) {
        tabs.forEach(tab => sortTab(tab, getters.settings.sortMode));
        commit('setTabs', tabs);
      }
    },

    /**
     * Fetch the playback applications from the backend
     */
    async getPlaybackApps({ commit }) {
      const playbackApps = await window.getPlayback();
      if (playbackApps) {
        commit('setPlaybackApps', playbackApps);
      }
    },

    /**
     * Set the outputs array and select the output accordingly
     */
    async setOutputs({ state, commit, dispatch }, outputs: Output[]) {
      commit('setOutputs', outputs);
      // if use as default device is enabled there should be no output application
      if (state.settings.useAsDefaultDevice) {
        commit('setSelectedOutput', null);
      } else {
        const { selectedOutput } = state;
        if (state.outputs.length > 0) {
          if (selectedOutput == null) {
            commit('setSelectedOutput', state.outputs[0]);
          } else {
            const current = state.outputs.find(({ name }) => name === selectedOutput.name);
            if (current) {
              commit('setSelectedOutput', current);
            } else {
              commit('setSelectedOutput', state.outputs[0]);
            }
          }
        } else {
          commit('setSelectedOutput', null);
        }
      }
      await dispatch('saveSettings');
    },

    /**
     * Set and save the currently selected output
     */
    async setSelectedOutput({ commit, dispatch }, selectedOutput: Output) {
      commit('setSelectedOutput', selectedOutput);
      await dispatch('saveSettings');
    },

    /**
     * Add a tab via the backend
     */
    async addTab({ commit, getters }) {
      const tab = await window.addTab();
      if (tab) {
        sortTab(tab, getters.settings.sortMode);
        commit('addTab', tab);
      }
    },

    /**
     * Remove a tab via the backend
     */
    async removeTab({ state, getters, commit, dispatch }, tab: Tab) {
      const removeIndex = state.tabs.indexOf(tab);

      const tabs = await window.removeTab(removeIndex);
      if (tabs) {
        commit('setTabs', tabs);

        // when removing a tab to the left of the active one, the active index must be decreased by one
        if (getters.activeTabIndex > removeIndex) {
          await dispatch('setActiveTabIndex', getters.activeTabIndex - 1);
        }

        // hide the confirmation modal
        commit('setRemoveTabModal', false);
      }
    },

    /**
     * Set and save the active tab index
     */
    async setActiveTabIndex({ commit, getters, dispatch }, index: number | undefined) {
      if (index !== undefined && index !== getters.activeTabIndex) {
        commit('setActiveTabIndex', index);
        await dispatch('saveSettings');
      }
    },

    /**
     * Refresh the current tab from the backend
     */
    async refreshTab({ commit, getters }) {
      if (getters.tabs.length === 0) {
        return;
      }
      const { activeTabIndex } = getters;
      const tab = getters.tabs[activeTabIndex];

      const refreshedTab = await window.refreshTab(activeTabIndex);
      if (refreshedTab) {
        sortTab(refreshedTab, getters.settings.sortMode);
        commit('setTabSounds', { tab, sounds: refreshedTab.sounds });
      }
    },

    /**
     * Update favorites from the backend
     */
    async getFavorites({ commit }): Promise<void> {
      const favorites = (await window.getFavorites()) || [];
      commit('setFavorites', favorites);
    },

    /**
     * Toggle favorites view
     */
    async setShowFavorites({ commit }, state: boolean) {
      commit('setShowFavorites', state);
      await window.isOnFavorites(state);
    },

    /**
     * Mark a sound as favorite via the backend
     */
    async toggleFavorite({ commit }, sound: Sound) {
      commit('toggleFavorite', sound);
      const favorites = await window.markFavorite(sound.id, sound.isFavorite);
      if (favorites) {
        commit('setFavorites', favorites);
      }
    },

    /**
     * Play a sound via the backend
     */
    async playSound({ commit }, sound: Sound) {
      const playingSound = await window.playSound(sound.id);
      if (playingSound) {
        commit('addToCurrentlyPlaying', playingSound);
      }
    },

    /**
     * Delete a sound via the backend
     */
    async deleteSound({ commit }, sound: Sound) {
      const deleted = await window.deleteSound(sound.id);
      if (deleted) {
        commit('deleteSound', sound);
        // hide the confirmation modal
        commit('setDeleteSoundModal', false);
      }
    },

    /**
     * Start an application passthrough via the backend
     */
    async startPassthrough({ commit }, app: Output) {
      const success = await window.startPassthrough(app.name);
      if (success) {
        commit('removePassthroughFromCurrentlyPlaying');
        commit('addToCurrentlyPlaying', app);
      }
    },

    /**
     * Stop all sounds via the backend
     */
    async stopSounds({ commit }) {
      await window.stopSounds();
      commit('clearCurrentlyPlaying');
    },

    /**
     * Refresh the outputs via the backend
     */
    async getOutputs({ dispatch }) {
      const outputs = await window.getOutputs();
      if (outputs) {
        dispatch('setOutputs', outputs);
      }
    },

    /**
     * Get settings from the backend
     */
    async getSettings({ commit }) {
      const settings = await window.getSettings();
      if (settings) {
        commit('setSettings', settings);
      }
    },

    /**
     * Set the useAsDefaultDevice setting and update the outputs accordingly
     */
    async setUseAsDefaultDevice({ commit, dispatch }, value: boolean) {
      commit('setUseAsDefaultDevice', value);
      if (value) {
        commit('setSelectedOutput', null);
      } else {
        // refresh outputs on disable because the selected output was set to null
        await dispatch('getOutputs');
      }
      await dispatch('saveSettings');
    },

    /**
     * Set the hotkeys for a sound via the backend
     */
    async setHotkeys({ commit }, data: { sound: Sound; hotkeys: number[] }) {
      commit('setHotkeys', data);
      await window.setHotkey(data.sound.id, data.sound.hotkeys);
    },

    /**
     * Save settings via the backend
     */
    async saveSettings({ state }) {
      await window.changeSettings(state.settings);
    },

    /**
     * Set and save the local volume
     */
    async setLocalVolume({ commit, dispatch }, volume: number) {
      commit('setLocalVolume', volume / 100);
      await dispatch('saveSettings');
    },

    /**
     * Set and save the remote volume
     */
    async setRemoteVolume({ commit, dispatch }, volume: number) {
      commit('setRemoteVolume', volume / 100);
      await dispatch('saveSettings');
    },

    /**
     * Get the information if running on linux from the backend
     */
    async getIsLinux({ commit }) {
      commit('setIsLinux', (await window.isLinux()) || false);
    },

    /**
     * Get the information if the switch on connect module is loaded from the backend
     */
    async isSwitchOnConnectLoaded({ commit }) {
      const result = (await window.isSwitchOnConnectLoaded()) || false;
      commit('setSwitchOnConnectLoaded', result);
    },

    /**
     * Unload the switch on connect module via the backend
     */
    async unloadSwitchOnConnect({ commit }) {
      await window.unloadSwitchOnConnect();
      commit('setSwitchOnConnectLoaded', false);
    },

    /**
     * Set the tab order in the backend
     */
    async moveTabs({ commit, state }) {
      const tabIds = state.tabs.map(({ id }) => id);
      const newTabs = await window.moveTabs(tabIds);
      if (newTabs) {
        commit('setTabs', newTabs);
      }
    },

    /**
     * Set and save the selected sort mode
     */
    async setSortMode({ commit, dispatch }, sortMode: SortMode) {
      commit('setSortMode', sortMode);
      await dispatch('saveSettings');
    },

    /**
     * Get the update data from the backend
     */
    async getUpdateData({ commit }) {
      const updateData = await window.updateCheck();
      if (updateData) {
        commit('setUpdateData', updateData);
      }
    },
  },
  modules: {},
  strict: process.env.NODE_ENV !== 'production',
});
