import { AppIFrameHelper } from '../utils';

jest.mock('vue', () => ({
  config: {
    lang: 'el',
  },
}));

describe('#AppIFrameHelper', () => {
  describe('#isAValidEvent', () => {
    it('returns if the event is valid', () => {
      expect(
        AppIFrameHelper.isAValidEvent({
          data:
            'chatwoot-widget:{"event":"config-set","locale":"fr","position":"left","hideMessageBubble":false,"showPopoutButton":true}',
        })
      ).toEqual(true);
      expect(
        AppIFrameHelper.isAValidEvent({
          data:
            '{"event":"config-set","locale":"fr","position":"left","hideMessageBubble":false,"showPopoutButton":true}',
        })
      ).toEqual(false);
    });
  });
  describe('#getMessage', () => {
    it('returns parsed message', () => {
      expect(
        AppIFrameHelper.getMessage({
          data:
            'chatwoot-widget:{"event":"config-set","locale":"fr","position":"left","hideMessageBubble":false,"showPopoutButton":true}',
        })
      ).toEqual({
        event: 'config-set',
        locale: 'fr',
        position: 'left',
        hideMessageBubble: false,
        showPopoutButton: true,
      });
    });
  });
});
