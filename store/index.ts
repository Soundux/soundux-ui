import { ActionTree, GetterTree, MutationTree } from 'vuex';
import Vue from 'vue';
import { Data, PlayingSound, Settings, Tab } from '~/types';

export const state = () => ({
  searchDrawer: false,
  tabs: [] as Tab[],
  activeTabIndex: 0,
  currentPlaying: [] as PlayingSound[],
  switchOnConnectLoaded: false,
  settings: {
    selectedTab: 0,
    allowOverlapping: true,
    darkTheme: true,
    stopHotkey: [] as number[],
    tabHotkeysOnly: false,
    gridView: false,
    useAsDefaultDevice: false,
  } as Settings,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  searchDrawer: state => state.searchDrawer,
  tabs: state => state.tabs,
  activeTabIndex: state => state.settings.selectedTab,
  currentPlaying: state => state.currentPlaying,
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
};

export const mutations: MutationTree<RootState> = {
  toggleSearchDrawer: state => (state.searchDrawer = !state.searchDrawer),
  setSearchDrawer: (state, newState: boolean) => (state.searchDrawer = newState),
  addTab: (state, tab: Tab) => state.tabs.push(tab),
  setTabs: (state, tabs: Tab[]) => (state.tabs = tabs),
  setActiveTabIndex: (state, index: number) => (state.settings.selectedTab = index),
  setSelectedSoundIndex: (state, { tabId, index }: { tabId: number; index: number | undefined }) => {
    const stateTab = state.tabs.find(({ id }) => id === tabId);
    if (stateTab) {
      // selectedSoundIndex can be undefined so it may be a new property which is not reactive when using a simple assignment
      Vue.set(stateTab, 'selectedSoundIndex', index);
    } else {
      console.error(`Could not find tab with id ${tabId}`);
    }
  },
  addToCurrentlyPlaying: (state, playingSound: PlayingSound) => state.currentPlaying.push(playingSound),
  clearCurrentlyPlaying: state => (state.currentPlaying = []),
  removeFromCurrentlyPlaying: (state, playingSound: PlayingSound) => {
    // search by id because object could be different (f.e. when the data comes from the backend)
    const realSound = state.currentPlaying.find(x => x.id === playingSound.id);
    if (realSound) {
      state.currentPlaying.splice(state.currentPlaying.indexOf(realSound), 1);
    }
  },
  setSettings: (state, value: Settings) => {
    state.settings = value;
    window.$nuxt.$root.$vuetify.theme.dark = value.darkTheme;
  },
  setTabHotkeysOnly: (state, value: boolean) => (state.settings.tabHotkeysOnly = value),
  setAllowOverlapping: (state, value: boolean) => (state.settings.allowOverlapping = value),
  setGridView: (state, value: boolean) => (state.settings.gridView = value),
  setUseAsDefaultDevice: (state, value: boolean) => (state.settings.useAsDefaultDevice = value),
  setDarkTheme: (state, value: boolean) => {
    state.settings.darkTheme = value;
    window.$nuxt.$root.$vuetify.theme.dark = value;
  },
  setSwitchOnConnectLoaded: (state, loaded: boolean) => (state.switchOnConnectLoaded = loaded),
};

export const actions: ActionTree<RootState, RootState> = {
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
  setActiveTabIndex({ commit, dispatch }, index: number) {
    commit('setActiveTabIndex', index);
    dispatch('saveSettings');
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
  async playSound({ commit, getters }) {
    // @ts-ignore
    if (!window.playSound) {
      return;
    }
    // @ts-ignore
    const playingSound = (await window.playSound(getters.activeSound.id)) as PlayingSound | false; // eslint-disable-line no-undef
    if (playingSound) {
      commit('addToCurrentlyPlaying', playingSound);
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

  async getSettings({ commit }) {
    // @ts-ignore
    if (!window.getSettings) {
      return;
    }
    // @ts-ignore
    const settings = (await window.getSettings()) as Settings; // eslint-disable-line no-undef
    console.log('settings loaded', settings);
    commit('setSettings', settings);
  },

  setUseAsDefaultDevice({ commit, dispatch }, value: boolean) {
    commit('setUseAsDefaultDevice', value);
    dispatch('saveSettings');
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
};
