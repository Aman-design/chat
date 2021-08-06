import { SET_DISPLAY_CONFIG } from '../types';

const state = {
  showPopoutButton: false, // Whether to display button to popout the widget
};

const getters = {
  getDisplayConfig: $state => $state,
};

const actions = {
  setDisplayConfig({ commit }, data) {
    commit(SET_DISPLAY_CONFIG, data);
  },
};

const mutations = {
  [SET_DISPLAY_CONFIG]($state, data) {
    $state.showPopoutButton = data.showPopoutButton;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
