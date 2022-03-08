import SettingsContent from '../Wrapper';
import Bot from './Index.vue';
import EditBot from './Edit.vue';
import NewBot from './New.vue';
import { frontendURL } from '../../../../helper/URLHelper';

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/settings/bot'),
      roles: ['administrator'],
      component: SettingsContent,
      props: {
        headerTitle: 'BOT.HEADER',
        icon: 'bot',
        showNewButton: false,
      },
      children: [
        {
          path: '',
          name: 'bot',
          component: Bot,
          roles: ['administrator'],
        },
        {
          path: 'new',
          name: 'bot',
          component: NewBot,
          roles: ['administrator'],
        },
        {
          path: ':botId',
          name: 'editbot',
          component: EditBot,
          roles: ['administrator'],
        },
      ],
    },
  ],
};
