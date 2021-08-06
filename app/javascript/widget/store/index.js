import Vue from 'vue';
import Vuex from 'vuex';
import agent from 'widget/store/modules/agent';
import appConfig from 'widget/store/modules/appConfig';
import campaign from 'widget/store/modules/campaign';
import contacts from 'widget/store/modules/contacts';
import conversation from 'widget/store/modules/conversation';
import conversationAttributes from 'widget/store/modules/conversationAttributes';
import conversationLabels from 'widget/store/modules/conversationLabels';
import displayConfig from 'widget/store/modules/displayConfig';
import events from 'widget/store/modules/events';
import globalConfig from 'shared/store/globalConfig';
import message from 'widget/store/modules/message';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    agent,
    appConfig,
    campaign,
    contacts,
    conversation,
    conversationAttributes,
    conversationLabels,
    displayConfig,
    events,
    globalConfig,
    message,
  },
});
