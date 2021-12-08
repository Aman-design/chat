import { mutations } from '../../messageNew/mutations';

const defaultState = {
  messages: {
    byId: {},
    allIds: [],
    uiFlags: {
      byId: {
        // 1: { isCreating: false, isPending: false, isDeleting: false, isUpdating: false },
      },
    },
  },
};
describe('#mutations', () => {
  describe('#addMessagesEntry', () => {
    it('it adds an array of messages in store', () => {
      const state = { ...defaultState };
      mutations.addMessagesEntry(state, {
        messages: [
          { id: 1, content: 'hi' },
          { id: 2, content: 'hello' },
        ],
      });
      expect(state.messages.byId).toEqual({
        1: { id: 1, content: 'hi' },
        2: { id: 2, content: 'hello' },
      });
    });

    describe('#addMessageIds', () => {
      it('it adds messages ids in store', () => {
        const state = { ...defaultState };
        mutations.addMessageIds(state, {
          messages: [
            { id: 1, content: 'hi' },
            { id: 2, content: 'hello' },
          ],
        });
        expect(state.messages.allIds).toEqual([1, 2]);
      });
    });

    describe('#updateMessageEntry', () => {
      it('it updates an existing messages in store', () => {
        const state = { ...defaultState, byId: { id: 1, content: 'hi' } };
        mutations.updateMessageEntry(state, {
          id: 1,
          content: 'whaaat',
        });
        expect(state.messages.byId[1]).toEqual({
          id: 1,
          content: 'whaaat',
        });
      });
    });

    describe('#removeMessageEntry', () => {
      it('it removes message from store', () => {
        const state = { ...defaultState, byId: { id: 1, content: 'hi' } };
        mutations.removeMessageEntry(state, 1);
        expect(state.messages.byId[1]).toEqual(undefined);
      });
    });

    describe('#removeMessageId', () => {
      it('it removes messages id from store', () => {
        const state = { ...defaultState, allIds: [1, 2, 4] };
        mutations.removeMessageId(state, 4);
        expect(state.messages.allIds).toEqual([1, 2]);
      });
    });

    describe('#setMessageUIFlag', () => {
      it('it sets UI flag for conversation correctly', () => {
        const state = {
          ...defaultState,
          uiFlags: {
            byId: {
              1: {
                isCreating: false,
                isPending: true,
                isDeleting: false,
                isUpdating: false,
              },
            },
          },
        };
        mutations.setMessageUIFlag(state, {
          messageId: 1,
          uiFlags: { isPending: true },
        });
        expect(state.messages.uiFlags.byId[1]).toEqual({
          isCreating: false,
          isPending: true,
          isDeleting: false,
          isUpdating: false,
        });
      });
    });
  });
});
