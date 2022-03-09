import * as MutationHelpers from 'shared/helpers/vuex/mutationHelpers';
import types from '../mutation-types';
import BotsAPI from '../../api/bots';

export const state = {
  records: [],
  uiFlags: {
    isFetching: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
  },
};

export const getters = {
  getBots(_state) {
    return _state.records;
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  },
  getBot: _state => botId => {
    const [bot] = _state.records.filter(record => record.id === Number(botId));
    return bot || {};
  },
};

export const actions = {
  get: async function getBOTs({ commit }) {
    commit(types.SET_BOT_UI_FLAG, { isFetching: true });
    try {
      const response = await BotsAPI.get();
      commit(types.SET_BOTS, response.data);
    } catch (error) {
      // Ignore error
    } finally {
      commit(types.SET_BOT_UI_FLAG, { isFetching: false });
    }
  },
  create: async function createBOT({ commit }, BOTObj) {
    commit(types.SET_BOT_UI_FLAG, { isCreating: true });
    try {
      const response = await BotsAPI.create(BOTObj);
      commit(types.ADD_BOT, response.data);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_BOT_UI_FLAG, { isCreating: false });
    }
  },
  update: async ({ commit }, { id, ...updateObj }) => {
    commit(types.SET_BOT_UI_FLAG, { isUpdating: true });
    try {
      const response = await BotsAPI.update(id, updateObj);
      commit(types.EDIT_BOT, response.data);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_BOT_UI_FLAG, { isUpdating: false });
    }
  },
  delete: async ({ commit }, id) => {
    commit(types.SET_BOT_UI_FLAG, { isDeleting: true });
    try {
      await BotsAPI.delete(id);
      commit(types.DELETE_BOT, id);
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_BOT_UI_FLAG, { isDeleting: false });
    }
  },
  getBotById: async ({ commit }, id) => {
    commit(types.SET_BOT_UI_FLAG, { isFetching: true });
    try {
      const { data } = await BotsAPI.getBotById(id);
      return data;
    } catch (error) {
      throw new Error(error);
    } finally {
      commit(types.SET_BOT_UI_FLAG, { isFetching: false });
    }
  },
};

export const mutations = {
  [types.SET_BOT_UI_FLAG](_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },
  [types.ADD_BOT]: MutationHelpers.create,
  [types.SET_BOTS]: MutationHelpers.set,
  [types.EDIT_BOT]: MutationHelpers.update,
  [types.DELETE_BOT]: MutationHelpers.destroy,
};

export default {
  namespaced: true,
  actions,
  state,
  getters,
  mutations,
};
