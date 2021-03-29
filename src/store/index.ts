import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from '@/plugins/vuetify';
import { Output, Playing, PlayingSound, Settings, SortMode, Sound, Tab, UpdateData } from '@/types';
import { sortTab } from '@/utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchModal: false,
    systemInfoModal: false,
    setHotkeyModal: false,
    setHotkeySound: null as Sound | null,
    appPassThroughDrawer: false,
    tabs: [] as Tab[],
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
      darkTheme: true,
      stopHotkey: [] as number[],
      sortMode: SortMode.ModifiedDate_Descending,
      tabHotkeysOnly: false,
      launchPadMode: false,
      gridView: false,
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
    appPassThroughDrawer: state => state.appPassThroughDrawer,
    tabs: state => state.tabs,
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
    setAppPassThroughDrawer: (state, newState: boolean) => {
      if (!state.searchModal) {
        state.appPassThroughDrawer = newState;
      }
    },
    addTab: (state, tab: Tab) => state.tabs.push(tab),
    setTabs: (state, tabs: Tab[]) => (state.tabs = tabs),
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
    setSettings: (state, value: Settings) => {
      state.settings = value;
      Vuetify.framework.theme.dark = value.darkTheme;
    },
    setLocalVolume: (state, volume: number) => (state.settings.localVolume = volume),
    setRemoteVolume: (state, volume: number) => (state.settings.remoteVolume = volume),
    setTabHotkeysOnly: (state, value: boolean) => (state.settings.tabHotkeysOnly = value),
    setLaunchpadMode: (state, value: boolean) => (state.settings.launchPadMode = value),
    setAllowOverlapping: (state, value: boolean) => (state.settings.allowOverlapping = value),
    setGridView: (state, value: boolean) => (state.settings.gridView = value),
    setUseAsDefaultDevice: (state, value: boolean) => (state.settings.useAsDefaultDevice = value),
    setMuteDuringPlayback: (state, value: boolean) => (state.settings.muteDuringPlayback = value),
    setSortMode: (state, sortMode: SortMode) => {
      state.settings.sortMode = sortMode;
      state.tabs.forEach((tab: Tab) => {
        sortTab(tab, sortMode);
      });
    },
    setStopHotkey: (state, value: number[]) => (state.settings.stopHotkey = value),
    setIsLinux: (state, value: boolean) => (state.isLinux = value),
    setIsDraggingSeekbar: (state, value: boolean) => (state.isDraggingSeekbar = value),
    setDarkTheme: (state, value: boolean) => {
      state.settings.darkTheme = value;
      Vuetify.framework.theme.dark = value;
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
     * Fetches the tabs from the backend
     */
    async getTabs({ commit, getters }) {
      const tabs = await window.getTabs();
      if (tabs) {
        tabs.forEach(tab => sortTab(tab, getters.settings.sortMode));
        commit('setTabs', tabs);
      }
    },

    /**
     * Fetches the playback applications from the backend
     */
    async getPlaybackApps({ commit }) {
      const playbackApps = await window.getPlayback();
      if (playbackApps) {
        commit('setPlaybackApps', playbackApps);
      }
    },

    setOutputs({ state, commit, dispatch }, outputs: Output[]) {
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
      dispatch('saveSettings');
    },

    setSelectedOutput({ commit, dispatch }, selectedOutput: Output) {
      commit('setSelectedOutput', selectedOutput);
      dispatch('saveSettings');
    },

    /**
     * Adds a tab via the backend
     */
    async addTab({ commit, getters }) {
      const tab = await window.addTab();
      if (tab) {
        sortTab(tab, getters.settings.sortMode);
        commit('addTab', tab);
      }
    },

    /**
     * Removes a tab via the backend
     */
    async deleteTab({ state, getters, commit, dispatch }, tab: Tab) {
      const deleteIndex = state.tabs.indexOf(tab);

      const tabs = await window.removeTab(deleteIndex);
      if (tabs) {
        commit('setTabs', tabs); // eslint-disable-line no-undef

        // when deleting a tab to the left of the active one, the active index must be decreased by one
        if (getters.activeTabIndex > deleteIndex) {
          dispatch('setActiveTabIndex', getters.activeTabIndex - 1);
        }
      }
    },

    /**
     * Sets and saves the active tab index
     */
    setActiveTabIndex({ commit, dispatch }, index: number | undefined) {
      if (index !== undefined) {
        commit('setActiveTabIndex', index);
        dispatch('saveSettings');
      }
    },

    /**
     * Refreshes tabs from the backend
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
     * Play a sound via the backend
     */
    async playSound({ commit }, sound: Sound) {
      const playingSound = await window.playSound(sound.id);
      if (playingSound) {
        commit('addToCurrentlyPlaying', playingSound);
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

    setUseAsDefaultDevice({ commit, dispatch }, value: boolean) {
      commit('setUseAsDefaultDevice', value);
      commit('setSelectedOutput', null);
      dispatch('saveSettings');
    },

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
    setLocalVolume({ commit, dispatch }, volume: number) {
      commit('setLocalVolume', volume / 100);
      dispatch('saveSettings');
    },
    setRemoteVolume({ commit, dispatch }, volume: number) {
      commit('setRemoteVolume', volume / 100);
      dispatch('saveSettings');
    },

    async getIsLinux({ commit }) {
      commit('setIsLinux', (await window.isLinux()) || false);
    },

    async isSwitchOnConnectLoaded({ commit }) {
      const result = (await window.isSwitchOnConnectLoaded()) || false;
      commit('setSwitchOnConnectLoaded', result);
    },

    async unloadSwitchOnConnect({ commit }) {
      await window.unloadSwitchOnConnect();
      commit('setSwitchOnConnectLoaded', false);
    },

    async moveTabs({ commit, state }) {
      const tabIds = state.tabs.map(({ id }) => id);
      const newTabs = await window.moveTabs(tabIds);
      if (newTabs) {
        commit('setTabs', newTabs);
      }
    },

    setSortMode({ commit, dispatch }, sortMode: SortMode) {
      commit('setSortMode', sortMode);
      dispatch('saveSettings');
    },

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
