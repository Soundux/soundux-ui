import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { Data, PlayingSound, Tab } from '~/types';

export const state = () => ({
  searchDrawer: false,
  tabs: [] as Tab[],
  activeTabIndex: 0,
  currentPlaying: [] as PlayingSound[],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  searchDrawer: state => state.searchDrawer,
  tabs: state => state.tabs,
  activeTabIndex: state => state.activeTabIndex,
  currentPlaying: state => state.currentPlaying,
  activeSound: state => {
    const tabs = state.tabs;
    if (tabs.length > 0) {
      const activeTabIndex = state.activeTabIndex;
      const tab = tabs[activeTabIndex];
      if (tab && tab.sounds.length > 0) {
        const selectedSoundIndex = tab.selectedSoundIndex;
        if (selectedSoundIndex !== undefined) {
          return tab.sounds[selectedSoundIndex];
        }
      }
    }
    return null;
  },
  allSounds: state => {
    return state.tabs.map(x => x.sounds).reduce((acc, e) => acc.concat(e), []);
  },
};

export const mutations: MutationTree<RootState> = {
  toggleSearchDrawer: state => (state.searchDrawer = !state.searchDrawer),
  setSearchDrawer: (state, newState: boolean) => (state.searchDrawer = newState),
  addTab: (state, tab: Tab) => state.tabs.push(tab),
  setTabs: (state, tabs: Tab[]) => (state.tabs = tabs),
  setActiveTabIndex: (state, index: number) => (state.activeTabIndex = index),
  addToCurrentlyPlaying: (state, playingSound: PlayingSound) => state.currentPlaying.push(playingSound),
  clearCurrentlyPlaying: state => (state.currentPlaying = []),
  removeFromCurrentlyPlaying: (state, playingSound: PlayingSound) => {
    // search by id because object could be different (f.e. when the data comes from the backend)
    const realSound = state.currentPlaying.find(x => x.id === playingSound.id);
    if (realSound) {
      state.currentPlaying.splice(state.currentPlaying.indexOf(realSound), 1);
    }
  },
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
  async deleteTab({ state, commit }, tab: Tab) {
    // @ts-ignore
    if (!window.removeTab) {
      return;
    }
    const deleteIndex = state.tabs.indexOf(tab);

    // @ts-ignore
    commit('setTabs', (await window.removeTab(deleteIndex)) as Tab[]); // eslint-disable-line no-undef

    // when deleting a tab to the left of the active one, the active index must be decreased by one
    if (state.activeTabIndex > deleteIndex) {
      commit('setActiveTabIndex', state.activeTabIndex - 1);
    }
  },

  async refreshTab({ state }) {
    // @ts-ignore
    if (!window.refreshTab) {
      return;
    }
    const tab = state.tabs[state.activeTabIndex];
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
};
