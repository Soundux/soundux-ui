import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from '../plugins/vuetify';
import { Data, Output, Playing, PlayingSound, Settings, Sound, Tab } from '@/types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchDrawer: false,
    tabs: [] as Tab[],
    outputs: [] as Output[],
    selectedOutput: null as Output | null,
    playbackApps: [] as Output[],
    currentPlaying: [] as Playing[],
    switchOnConnectLoaded: false,
    isLinux: false,
    settings: {
      output: '',
      selectedTab: 0,
      allowOverlapping: true,
      darkTheme: true,
      stopHotkey: [] as number[],
      tabHotkeysOnly: false,
      gridView: false,
      localVolume: 0,
      remoteVolume: 0,
      useAsDefaultDevice: false,
    } as Settings,
  },
  getters: {
    searchDrawer: state => state.searchDrawer,
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
    activeSound: (state, getters) => {
      const { tabs } = state;
      if (tabs.length > 0) {
        const { activeTabIndex } = getters;
        const tab = tabs[activeTabIndex];
        if (tab && tab.sounds.length > 0) {
          const { selectedSoundIndex } = tab;
          if (selectedSoundIndex !== undefined) {
            return tab.sounds[selectedSoundIndex];
          }
        }
      }
      return null;
    },
    allSounds: state => {
      return state.tabs.map(({ sounds }) => sounds).reduce((acc, e) => acc.concat(e), []);
    },
    isLinux: state => state.isLinux,
  },
  mutations: {
    toggleSearchDrawer: state => (state.searchDrawer = !state.searchDrawer),
    setSearchDrawer: (state, newState: boolean) => (state.searchDrawer = newState),
    addTab: (state, tab: Tab) => state.tabs.push(tab),
    setTabs: (state, tabs: Tab[]) => (state.tabs = tabs),
    setActiveTabIndex: (state, index: number) => (state.settings.selectedTab = index),
    setOutputs: (state, outputs: Output[]) => (state.outputs = outputs),
    setPlaybackApps: (state, playbackApps: Output[]) => (state.playbackApps = playbackApps),
    setSelectedOutput: (state, selectedOutput: Output | null) => {
      state.selectedOutput = selectedOutput;
      state.settings.output = selectedOutput ? selectedOutput.name : '';
    },
    setSelectedSoundIndex: (state, { tabId, index }: { tabId: number; index: number | undefined }) => {
      const stateTab = state.tabs.find(({ id }) => id === tabId);
      if (stateTab) {
        // for grid view
        if (stateTab.selectedSoundIndex === index) {
          index = undefined;
        }
        // selectedSoundIndex can be undefined so it may be a new property which is not reactive when using a simple assignment
        Vue.set(stateTab, 'selectedSoundIndex', index);
      } else {
        console.error(`Could not find tab with id ${tabId}`);
      }
    },
    updateSound: (
      _state,
      { playing, ms, paused }: { playing: PlayingSound; ms?: number; paused?: boolean }
    ) => {
      if (ms !== undefined) {
        playing.readInMs = ms;
      }
      if (paused !== undefined) {
        playing.paused = paused;
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
    setAllowOverlapping: (state, value: boolean) => (state.settings.allowOverlapping = value),
    setGridView: (state, value: boolean) => (state.settings.gridView = value),
    setUseAsDefaultDevice: (state, value: boolean) => (state.settings.useAsDefaultDevice = value),
    setStopHotkey: (state, value: number[]) => (state.settings.stopHotkey = value),
    setIsLinux: (state, value: boolean) => (state.isLinux = value),
    setDarkTheme: (state, value: boolean) => {
      state.settings.darkTheme = value;
      Vuetify.framework.theme.dark = value;
    },
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
    async getData({ commit }) {
      // @ts-ignore
      if (!window.getData) {
        return;
      }
      // @ts-ignore
      const data = (await window.getData()) as Data; // eslint-disable-line no-undef
      commit('setTabs', data.tabs);
    },

    /**
     * Fetches the playback applications from the backend
     */
    async getPlaybackApps({ commit }) {
      // @ts-ignore
      if (!window.getPlayback) {
        return;
      }
      // @ts-ignore
      const playbackApps = (await window.getPlayback()) as Output[]; // eslint-disable-line no-undef
      commit('setPlaybackApps', playbackApps);
    },

    setOutputs({ state, commit, dispatch }, outputs: Output[]) {
      commit('setOutputs', outputs);
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
      dispatch('saveSettings');
    },

    setSelectedOutput({ commit, dispatch }, selectedOutput: Output) {
      commit('setSelectedOutput', selectedOutput);
      dispatch('saveSettings');
    },

    /**
     * Adds a tab via the backend
     */
    async addTab({ commit }) {
      // @ts-ignore
      if (!window.addTab) {
        return;
      }
      // @ts-ignore
      const tab = (await window.addTab()) as Tab | false; // eslint-disable-line no-undef
      if (tab) {
        commit('addTab', tab);
      }
    },

    /**
     * Removes a tab via the backend
     */
    async deleteTab({ state, getters, commit, dispatch }, tab: Tab) {
      // @ts-ignore
      if (!window.removeTab) {
        return;
      }
      const deleteIndex = state.tabs.indexOf(tab);

      // @ts-ignore
      commit('setTabs', (await window.removeTab(deleteIndex)) as Tab[]); // eslint-disable-line no-undef

      // when deleting a tab to the left of the active one, the active index must be decreased by one
      if (getters.activeTabIndex > deleteIndex) {
        dispatch('setActiveTabIndex', getters.activeTabIndex - 1);
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
    async refreshTab({ state, getters }) {
      // @ts-ignore
      if (!window.refreshTab) {
        return;
      }
      const tab = state.tabs[getters.activeTabIndex];
      const refreshIndex = state.tabs.indexOf(tab);

      // @ts-ignore
      const refreshedTab = (await window.refreshTab(refreshIndex)) as Tab | false; // eslint-disable-line no-undef

      if (refreshedTab) {
        tab.sounds = refreshedTab.sounds;
      }
    },

    /**
     * Play a sound via the backend
     */
    async playSound({ commit, getters }, sound: Sound = getters.activeSound) {
      // It might be null if there are no outputs available, this should normally not happen since the button is disabled in this case
      if (!getters.selectedOutput) {
        return;
      }
      // @ts-ignore
      if (!window.playSound) {
        return;
      }
      // @ts-ignore
      const playingSound = (await window.playSound(sound.id)) as PlayingSound | false; // eslint-disable-line no-undef
      if (playingSound) {
        commit('addToCurrentlyPlaying', playingSound);
      }
    },

    /**
     * Start an application passthrough via the backend
     */
    async startPassthrough({ commit, getters }, app: Output) {
      // It might be null if there are no outputs available, this should normally not happen since the button is disabled in this case
      if (!getters.selectedOutput) {
        return;
      }
      // @ts-ignore
      if (!window.startPassthrough) {
        return;
      }
      // @ts-ignore
      const recordingStream = (await window.startPassthrough(app.name)) as Output | false; // eslint-disable-line no-undef
      if (recordingStream) {
        commit('removePassthroughFromCurrentlyPlaying');
        commit('addToCurrentlyPlaying', recordingStream);
      }
    },

    /**
     * Stop all sounds via the backend
     */
    async stopSounds({ commit }) {
      // @ts-ignore
      if (!window.playSound) {
        return;
      }
      // @ts-ignore
      await window.stopSounds(); // eslint-disable-line no-undef
      commit('clearCurrentlyPlaying');
    },

    async getOutputs({ dispatch }) {
      // @ts-ignore
      if (!window.getOutput) {
        return;
      }
      // @ts-ignore
      const outputs = (await window.getOutput()) as Settings; // eslint-disable-line no-undef
      dispatch('setOutputs', outputs);
    },

    /**
     * Get settings from the backend
     */
    async getSettings({ commit }) {
      // @ts-ignore
      if (!window.getSettings) {
        return;
      }
      // @ts-ignore
      const settings = (await window.getSettings()) as Settings; // eslint-disable-line no-undef
      commit('setSettings', settings);
    },

    setUseAsDefaultDevice({ commit, dispatch }, value: boolean) {
      commit('setUseAsDefaultDevice', value);
      dispatch('saveSettings');
    },

    async setHotkeys({ commit }, data: { sound: Sound; hotkeys: number[] }) {
      commit('setHotkeys', data);
      // @ts-ignore
      await window.setHotkey(data.sound.id, data.sound.hotkeys); // eslint-disable-line no-undef
    },

    /**
     * Save settings via the backend
     */
    async saveSettings({ state }) {
      // @ts-ignore
      if (!window.changeSettings) {
        return;
      }
      // @ts-ignore
      await window.changeSettings(JSON.stringify(state.settings)); // eslint-disable-line no-undef
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
      // @ts-ignore
      if (!window.isLinux) {
        return;
      }
      // @ts-ignore
      commit('setIsLinux', (await window.isLinux()) as boolean); // eslint-disable-line no-undef
    },

    async isSwitchOnConnectLoaded({ commit }) {
      // @ts-ignore
      if (!window.isSwitchOnConnectLoaded) {
        return;
      }
      // @ts-ignore
      const result = (await window.isSwitchOnConnectLoaded()) as boolean; // eslint-disable-line no-undef
      commit('setSwitchOnConnectLoaded', result);
    },

    async unloadSwitchOnConnect({ commit }) {
      // @ts-ignore
      if (!window.unloadSwitchOnConnect) {
        return;
      }
      // @ts-ignore
      await window.unloadSwitchOnConnect(); // eslint-disable-line no-undef
      commit('setSwitchOnConnectLoaded', false);
    },
  },
  modules: {},
});
