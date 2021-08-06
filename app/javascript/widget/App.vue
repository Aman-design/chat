<template>
  <div id="app" class="woot-widget-wrap">
    <home
      v-if="!showUnreadView && !showCampaignView"
      :unread-message-count="unreadMessageCount"
    />
    <unread
      v-else
      :show-unread-view="showUnreadView"
      :unread-message-count="unreadMessageCount"
    />
  </div>
</template>
<script>
import Home from './views/Home';
import Unread from './views/Unread';
import { mapGetters, mapActions } from 'vuex';
import { setHeader } from 'widget/helpers/axios';
import { AppIFrameHelper, RNHelper } from 'widget/helpers/utils';
import { getLocale } from './helpers/urlParamsHelper';
import { BUS_EVENTS } from 'shared/constants/busEvents';
import { isEmptyObject } from 'widget/helpers/utils';
import { WIDGET_EVENTS } from './constants/widgetEvents';
export default {
  name: 'App',
  components: {
    Home,
    Unread,
  },
  data() {
    return {
      showUnreadView: false,
      showCampaignView: false,
      isWebWidgetTriggered: false,
      isIFrame: AppIFrameHelper.isIFrame(),
      isRNWebView: RNHelper.isRNWebView(),
    };
  },
  computed: {
    ...mapGetters({
      messageCount: 'conversation/getMessageCount',
      unreadMessageCount: 'conversation/getUnreadMessageCount',
      campaigns: 'campaign/getCampaigns',
      activeCampaign: 'campaign/getActiveCampaign',
    }),
  },
  watch: {
    activeCampaign() {
      this.setCampaignView();
    },
    showUnreadView(newVal) {
      if (newVal) {
        this.setIframeHeight(this.isMobile);
      }
    },
    showCampaignView(newVal) {
      if (newVal) {
        this.setIframeHeight(this.isMobile);
      }
    },
  },
  mounted() {
    const { websiteToken, locale } = window.chatwootWebChannel;
    setHeader('X-Auth-Token', window.authToken);

    this.setLocale(locale);
    if (this.isIFrame || this.isRNWebView) {
      this.registerListeners();
      this.sendLoadedEvent();
    } else {
      this.fetchOldConversations();
      this.fetchAvailableAgents(websiteToken);
      this.setLocale(getLocale(window.location.search));
    }
    this.$store.dispatch('conversationAttributes/getAttributes');
    this.setWidgetColor(window.chatwootWebChannel);
    this.registerUnreadEvents();
    this.registerCampaignEvents();
  },
  methods: {
    ...mapActions('appConfig', ['setWidgetColor']),
    ...mapActions('displayConfig', ['setDisplayConfig']),
    ...mapActions('conversation', ['fetchOldConversations', 'setUserLastSeen']),
    ...mapActions('campaign', ['initCampaigns', 'executeCampaign']),
    ...mapActions('agent', ['fetchAvailableAgents']),
    ...mapMutations('events', ['toggleOpen']),
    setBubbleLabel() {
      AppIFrameHelper.sendMessage({
        event: 'setBubbleLabel',
        label: this.$t('BUBBLE.LABEL'),
      });
    },
    setIframeHeight(isFixedHeight) {
      this.$nextTick(() => {
        const extraHeight = this.getExtraSpaceToscroll();
        IFrameHelper.sendMessage({
          event: 'updateIframeHeight',
          isFixedHeight,
          extraHeight,
        });
      });
    },
    setLocale(locale) {
      const { enabledLanguages } = window.chatwootWebChannel;
      if (enabledLanguages.some(lang => lang.iso_639_1_code === locale)) {
        this.$root.$i18n.locale = locale;
      }
    },
    registerUnreadEvents() {
      bus.$on('on-agent-message-recieved', () => {
        if (!this.isIFrame) {
          this.setUserLastSeen();
        }
        this.setUnreadView();
      });
      bus.$on('on-unread-view-clicked', () => {
        this.unsetUnreadView();
        this.setUserLastSeen();
      });
    },
    registerCampaignEvents() {
      bus.$on('on-campaign-view-clicked', campaignId => {
        const { websiteToken } = window.chatwootWebChannel;
        this.showCampaignView = false;
        this.showUnreadView = false;
        this.unsetUnreadView();
        this.setUserLastSeen();
        this.executeCampaign({ campaignId, websiteToken });
      });
    },
    setCampaignView() {
      const { messageCount, activeCampaign } = this;
      const isCampaignReadyToExecute =
        !isEmptyObject(activeCampaign) &&
        !messageCount &&
        !this.isWebWidgetTriggered;
      if (this.isIFrame && isCampaignReadyToExecute) {
        this.showCampaignView = true;
        AppIFrameHelper.sendMessage({ event: 'setCampaignMode' });
        this.setIframeHeight(this.isMobile);
      }
    },
    setUnreadView() {
      const { unreadMessageCount } = this;
      if (this.isIFrame && unreadMessageCount > 0) {
        AppIFrameHelper.sendMessage({
          event: 'setUnreadMode',
          unreadMessageCount,
        });
        this.setIframeHeight(this.isMobile);
      }
    },
    unsetUnreadView() {
      if (this.isIFrame) {
        AppIFrameHelper.sendMessage({ event: 'resetUnreadMode' });
        this.setIframeHeight();
      }
    },
    createWidgetEvents(message) {
      const { eventName } = message;
      const isWidgetTriggerEvent = eventName === 'webwidget.triggered';
      this.isWebWidgetTriggered = true;
      if (
        isWidgetTriggerEvent &&
        (this.showUnreadView || this.showCampaignView)
      ) {
        return;
      }
      this.setUserLastSeen();
      this.$store.dispatch('events/create', { name: eventName });
    },
    registerListeners() {
      const { websiteToken } = window.chatwootWebChannel;
      window.addEventListener('message', e => {
        if (!AppIFrameHelper.isAValidEvent(e)) {
          return;
        }
        const message = AppIFrameHelper.getMessage(e);
        const { event, ...eventData } = message;
        if (message.event === WIDGET_EVENTS.T_WIDGET_INITIALIZE_COMPLETE) {
          this.setDisplayConfig(eventData);
          this.setLocale(message.locale);
          this.setBubbleLabel();
          this.fetchOldConversations().then(() => this.setUnreadView());
          this.fetchAvailableAgents(websiteToken);
          this.$store.dispatch('contacts/get');
        } else if (message.event === WIDGET_EVENTS.T_UPDATE_WEBSITE_URL) {
          const { referrerURL, referrerHost } = message;
          this.initCampaigns({ currentURL: referrerURL, websiteToken });
          window.referrerURL = referrerURL;
          bus.$emit(BUS_EVENTS.SET_REFERRER_HOST, referrerHost);
        } else if (message.event === WIDGET_EVENTS.T_TOGGLE_MOBILE_VIEW) {
          this.setDisplayConfig({ isMobile: message.isMobile });
        } else if (message.event === 'push-event') {
          this.createWidgetEvents(message);
        } else if (message.event === 'set-label') {
          this.$store.dispatch('conversationLabels/create', message.label);
        } else if (message.event === 'remove-label') {
          this.$store.dispatch('conversationLabels/destroy', message.label);
        } else if (message.event === 'set-user') {
          this.$store.dispatch('contacts/update', message);
        } else if (message.event === 'set-custom-attributes') {
          this.$store.dispatch(
            'contacts/setCustomAttributes',
            message.customAttributes
          );
        } else if (message.event === 'delete-custom-attribute') {
          this.$store.dispatch('contacts/setCustomAttributes', {
            [message.customAttribute]: null,
          });
        } else if (message.event === 'set-locale') {
          this.setLocale(message.locale);
          this.setBubbleLabel();
        } else if (message.event === 'set-unread-view') {
          this.showUnreadView = true;
          this.showCampaignView = false;
        } else if (message.event === 'unset-unread-view') {
          this.showUnreadView = false;
          this.showCampaignView = false;
        } else if (message.event === 'toggle-open') {
          this.toggleOpen();
        }
      });
    },
    sendLoadedEvent() {
      const helper = this.isRNWebView ? RNHelper : AppIFrameHelper;
      helper.sendMessage({
        event: WIDGET_EVENTS.F_SET_COOKIE_INFORMATION,
        config: {
          authToken: window.authToken,
          channelConfig: window.chatwootWebChannel,
        },
      });
    },
    getExtraSpaceToscroll: () => {
      // This function calculates the extra space needed for the view to
      // accomodate the height of close button + height of
      // read messages button. So that scrollbar won't appear
      const unreadMessageWrap = document.querySelector('.unread-messages');
      const unreadCloseWrap = document.querySelector('.close-unread-wrap');
      const readViewWrap = document.querySelector('.open-read-view-wrap');

      if (!unreadMessageWrap) return 0;

      // 24px to compensate the paddings
      let extraHeight = 24 + unreadMessageWrap.scrollHeight;
      if (unreadCloseWrap) extraHeight += unreadCloseWrap.scrollHeight;
      if (readViewWrap) extraHeight += readViewWrap.scrollHeight;

      return extraHeight;
    },
  },
};
</script>

<style lang="scss">
@import '~widget/assets/scss/woot.scss';
</style>
