import { SET_DISPLAY_CONFIG } from '../types';

const state = {
  showPopoutButton: false, // Whether to display button to popout the widget
  hideMessageBubble: false, // Whether to hide the message bubble
  isMobile: false, // Whether the user is using a mobile device
  position: 'right', // Position of the widget
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
  [SET_DISPLAY_CONFIG]($state, data = {}) {
    Object.assign($state, data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
