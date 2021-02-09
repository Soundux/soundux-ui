import { ActionTree, GetterTree, MutationTree } from 'vuex';

export const state = () => ({
  searchDrawer: false,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  searchDrawer: (state) => state.searchDrawer,
};

export const mutations: MutationTree<RootState> = {
  toggleSearchDrawer: (state) => (state.searchDrawer = !state.searchDrawer),
  setSearchDrawer: (state, newState: boolean) =>
    (state.searchDrawer = newState),
};

export const actions: ActionTree<RootState, RootState> = {
  // TODO: implement backend fetch functions
  fetchBackend({ commit }) {
    // fetch from "backend"
    commit('setSearchDrawer', true);
  },
};
