import { getters } from '../../conversationNew/getters';
import { getters as messageGetters } from '../../messageNew/getters';

const defaultState = {
  conversations: {
    byId: {
      1: {
        id: 1,
        messages: [10],
      },
    },
    allIds: [1],
    uiFlags: {
      byId: {
        1: { allFetched: true, isAgentTyping: false, isFetching: false },
      },
    },
    meta: {
      byId: {
        1: { userLastSeenAt: 1234, status: 'open' },
      },
    },
  },
  uiFlags: {
    allFetched: true,
    isFetching: false,
    isCreating: false,
  },
};

describe('#getters', () => {
  it('uiFlagsIn', () => {
    const state = { ...defaultState };
    expect(getters.uiFlagsIn(state)(1)).toEqual({
      allFetched: true,
      isAgentTyping: false,
      isFetching: false,
    });
  });

  it('metaIn', () => {
    const state = { ...defaultState };
    expect(getters.metaIn(state)(1)).toEqual({
      userLastSeenAt: 1234,
      status: 'open',
    });
  });

  it('isAllMessagesFetchedIn', () => {
    const state = { ...defaultState };
    expect(
      getters.isAllMessagesFetchedIn(state, {
        uiFlagsIn: getters.uiFlagsIn(state),
      })(1)
    ).toEqual(true);
  });

  it('isCreating', () => {
    const state = { ...defaultState };
    expect(getters.isCreating(state)).toEqual(false);
  });

  it('isAgentTypingIn', () => {
    const state = { ...defaultState };
    expect(
      getters.isAgentTypingIn(state, {
        uiFlagsIn: getters.uiFlagsIn(state),
      })(1)
    ).toEqual(false);
  });

  it('isFetchingConversationsList', () => {
    const state = { ...defaultState };
    expect(getters.isFetchingConversationsList(state)).toEqual(false);
  });

  describe('#allConversations', () => {
    const state = {
      ...defaultState,
      conversations: {
        ...defaultState.conversations,
        byId: {
          1: {
            id: 1,
            messages: [10, 11],
          },
        },
      },
    };
    it('It return array of all messages in a conversation', () => {
      expect(
        getters.allConversations(
          state,
          {},
          {},
          {
            ['message/messageById'](id) {
              const messageState = {
                messages: {
                  byId: {
                    10: { id: 10, content: 'hi' },
                    11: { id: 11, content: 'hi' },
                  },
                },
              };
              return messageGetters.messageById(messageState)(id);
            },
          }
        )
      ).toEqual([
        {
          id: 1,
          messages: [
            { id: 10, content: 'hi' },
            { id: 11, content: 'hi' },
          ],
        },
      ]);
    });
  });
});
