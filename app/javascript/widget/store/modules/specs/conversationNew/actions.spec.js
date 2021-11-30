import { actions } from '../../conversationNew/actions';
import { API } from 'widget/helpers/axios';

jest.mock('../../../../helpers/uuid');
jest.mock('widget/helpers/axios');

const commit = jest.fn();

describe('#actions', () => {
  describe('#fetchAllConversations', () => {
    it('sends correct mutations', async () => {
      API.get.mockResolvedValue({
        data: [
          {
            id: 1,
            messages: [{ id: 12 }],
            status: 'open',
            contact_last_seen_at: 12345,
          },
        ],
      });

      await actions.fetchAllConversations({ commit });
      expect(commit.mock.calls).toEqual([
        ['setUIFlag', { isFetching: true }],
        [
          'addConversationEntry',
          {
            id: 1,
            messages: [{ id: 12 }],
            status: 'open',
            contact_last_seen_at: 12345,
          },
        ],
        ['addConversationId', 1],
        ['setConversationUIFlag', { uiFlags: {}, conversationId: 1 }],
        [
          'setConversationMeta',
          {
            meta: { userLastSeenAt: 12345, status: 'open' },
            conversationId: 1,
          },
        ],
        [
          'message/addMessagesEntry',
          { conversationId: 1, messages: [{ id: 12 }] },
          { root: true },
        ],
        [
          'addMessageIdsToConversation',
          { conversationId: 1, messages: [{ id: 12 }] },
        ],
        ['setUIFlag', { isFetching: false }],
      ]);
    });
  });

  describe('#fetchOldMessagesIn', () => {
    it('sends correct mutations', async () => {
      API.get.mockResolvedValue({
        data: [
          {
            id: 1,
            content: 'h1',
            conversation_id: 1,
          },
        ],
      });

      await actions.fetchOldMessagesIn(
        { commit },
        { conversationId: 1, beforeId: 2 }
      );
      expect(commit.mock.calls).toEqual([
        [
          'setConversationUIFlag',
          { uiFlags: { isFetching: true }, conversationId: 1 },
        ],
        [
          'message/addMessagesEntry',
          {
            conversationId: 1,
            messages: [
              {
                id: 1,
                content: 'h1',
                conversation_id: 1,
              },
            ],
          },
          { root: true },
        ],
        [
          'prependMessageIdsToConversation',
          {
            conversationId: 1,
            messages: [
              {
                id: 1,
                content: 'h1',
                conversation_id: 1,
              },
            ],
          },
        ],
        [
          'setConversationUIFlag',
          {
            conversationId: 1,
            uiFlags: { allFetched: true },
          },
        ],
        [
          'setConversationUIFlag',
          {
            conversationId: 1,
            uiFlags: { isFetching: false },
          },
        ],
      ]);
    });
  });

  describe('#addConversation', () => {
    it('sends correct mutations', async () => {
      await actions.addConversation(
        { commit },
        {
          id: 1,
          messages: [{ id: 12 }],
          status: 'open',
          contact_last_seen_at: 12345,
        }
      );
      expect(commit).toHaveBeenNthCalledWith(1, 'addConversationEntry', {
        id: 1,
        messages: [{ id: 12 }],
        status: 'open',
        contact_last_seen_at: 12345,
      });
      expect(commit).toHaveBeenNthCalledWith(2, 'addConversationId', 1);
      expect(commit).toHaveBeenNthCalledWith(3, 'setConversationUIFlag', {
        uiFlags: { isAgentTyping: false },
        conversationId: 1,
      });
      expect(commit).toHaveBeenNthCalledWith(4, 'setConversationMeta', {
        meta: { userLastSeenAt: 12345 },
        conversationId: 1,
      });
      expect(commit).toHaveBeenNthCalledWith(
        5,
        'message/addMessagesEntry',
        { conversationId: 1, messages: [{ id: 12 }] },
        { root: true }
      );
      expect(commit).toHaveBeenNthCalledWith(6, 'addMessageIdsToConversation', {
        conversationId: 1,
        messages: [{ id: 12 }],
      });
    });
  });

  describe('#createConversationWithMessage', () => {
    it('sends correct mutations', async () => {
      API.post.mockResolvedValue({
        data: {
          id: 1,
          messages: [{ id: 12 }],
          status: 'open',
          contact_last_seen_at: 12345,
        },
      });

      await actions.createConversationWithMessage(
        { commit },
        {
          contact: {
            name: 'Lolan',
            email: 'lel@max.in',
          },
          message: {
            content: 'hi',
            timestamp: 12345,
            referer_url: '',
          },
        }
      );
      expect(commit.mock.calls).toEqual([
        ['setUIFlag', { isCreating: true }],
        [
          'addConversationEntry',
          {
            id: 1,
            messages: [{ id: 12 }],
            status: 'open',
            contact_last_seen_at: 12345,
          },
        ],
        ['addConversationId', 1],
        [
          'setConversationUIFlag',
          { uiFlags: { isAgentTyping: false }, conversationId: 1 },
        ],
        [
          'setConversationMeta',
          {
            meta: { userLastSeenAt: 12345 },
            conversationId: 1,
          },
        ],
        [
          'message/addMessagesEntry',
          { conversationId: 1, messages: [{ id: 12 }] },
          { root: true },
        ],
        [
          'addMessageIdsToConversation',
          { conversationId: 1, messages: [{ id: 12 }] },
        ],
        ['setUIFlag', { isCreating: false }],
      ]);
    });
  });

  describe('#toggleAgentTypingIn', () => {
    it('sends correct mutations', async () => {
      await actions.toggleAgentTypingIn(
        { commit },
        {
          conversationId: 1,
          status: 'on',
        }
      );
      expect(commit).toHaveBeenNthCalledWith(1, 'setConversationUIFlag', {
        uiFlags: { isAgentTyping: true },
        conversationId: 1,
      });
    });
  });

  describe('#toggleUserTypingIn', () => {
    it('sends correct mutations', async () => {
      API.post.mockResolvedValue({});

      await actions.toggleUserTypingIn({ commit }, {});
      expect(commit.mock.calls).toEqual([]);
    });
  });

  describe('#setUserLastSeenIn', () => {
    it('sends correct mutations', async () => {
      API.post.mockResolvedValue({});

      await actions.setUserLastSeenIn(
        {
          commit,
          getters: {
            allMessagesCountIn() {
              return 1;
            },
          },
        },
        { conversationId: 1, userLastSeenAt: 1234 }
      );
      expect(commit.mock.calls).toEqual([
        [
          'setConversationMeta',
          {
            meta: { userLastSeenAt: 1234 },
            conversationId: 1,
          },
        ],
      ]);
    });
  });

  describe('#setConversationStatusIn', () => {
    it('sends correct mutations', async () => {
      await actions.setConversationStatusIn(
        { commit },
        {
          conversationId: 1,
          status: 'open',
        }
      );
      expect(commit).toHaveBeenNthCalledWith(1, 'setConversationMeta', {
        meta: { status: 'open' },
        conversationId: 1,
      });
    });
  });
});
