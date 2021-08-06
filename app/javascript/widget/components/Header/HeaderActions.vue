<template>
  <div
    v-if="showHeaderActions"
    class="actions flex items-center"
    :class="{ 'is-mobile': displayConfig.isMobile }"
  >
    <button
      v-if="displayConfig.showPopoutButton"
      class="button transparent compact new-window--button"
      @click="popoutWindow"
    >
      <span class="ion-android-open" />
    </button>
    <button
      class="button transparent compact close-button"
      :class="{
        'rn-close-button': isRNWebView,
        'is-bubble-hidden': displayConfig.hideMessageBubble,
      }"
    >
      <span class="ion-android-close" @click="closeWindow" />
    </button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { AppIFrameHelper, RNHelper } from 'widget/helpers/utils';
import { buildPopoutURL } from '../../helpers/urlParamsHelper';

export default {
  name: 'HeaderActions',
  computed: {
    ...mapGetters({ displayConfig: 'displayConfig/getDisplayConfig' }),
    isIframe() {
      return AppIFrameHelper.isIFrame();
    },
    isRNWebView() {
      return RNHelper.isRNWebView();
    },
    showHeaderActions() {
      return this.isIframe || this.isRNWebView;
    },
  },
  methods: {
    popoutWindow() {
      this.closeWindow();
      const {
        location: { origin },
        chatwootWebChannel: { websiteToken },
        authToken,
      } = window;

      const popoutWindowURL = buildPopoutURL({
        origin,
        websiteToken,
        locale: this.$root.$i18n.locale,
        conversationCookie: authToken,
      });
      const popoutWindow = window.open(
        popoutWindowURL,
        `webwidget_session_${websiteToken}`,
        'resizable=off,width=400,height=600'
      );
      popoutWindow.focus();
    },
    closeWindow() {
      if (AppIFrameHelper.isIFrame()) {
        AppIFrameHelper.sendMessage({ event: 'toggleBubble' });
      } else if (RNHelper.isRNWebView) {
        RNHelper.sendMessage({ type: 'close-widget' });
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import '~widget/assets/scss/variables.scss';

.close-button.is-bubble-hidden {
  display: block !important;
}

.actions.is-mobile {
  .close-button {
    display: block !important;
  }

  .new-window--button {
    display: none !important;
  }
}

.actions {
  button {
    margin-left: $space-normal;
  }

  span {
    color: $color-heading;
    font-size: $font-size-large;

    &.ion-android-close {
      font-size: $font-size-big;
    }
  }

  .close-button {
    display: none;
  }
  .rn-close-button {
    display: block !important;
  }
}
</style>
