import Vue from 'vue';
import { getAvailableAgents } from 'widget/api/agent';
import * as MutationHelpers from 'shared/helpers/vuex/mutationHelpers';

const state = {
  records: [],
  uiFlags: {},
};

export const getters = {
  getHasFetched: $state => $state.uiFlags.hasFetched,
  availableAgents: $state =>
    $state.records.filter(agent => agent.availability_status === 'online'),
};

export const actions = {
  fetchAvailableAgents: async ({ commit }, websiteToken) => {
    try {
      const { data } = await getAvailableAgents(websiteToken);
      const { payload = [] } = data;
      commit('setAgents', payload);
    } catch (error) {
      // Ignore error as the data fetched is used
      // only to display available agents
    }
  },
  updatePresence: async ({ commit }, data) => {
    commit('updatePresence', data);
  },
};

export const mutations = {
  setAgents($state, data) {
    Vue.set($state, 'records', data);
  },
  updatePresence: MutationHelpers.updatePresence,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
