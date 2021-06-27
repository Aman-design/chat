<template>
  <div class="chat-bubble-wrap">
    <div
      v-if="
        !isCards && !isOptions && !isForm && !isArticle && !isCards && !isCSAT
      "
      class="chat-bubble agent"
    >
      <div class="message-content" v-html="formatMessage(message, false)"></div>
      <email-input
        v-if="isTemplateEmail"
        :message-id="messageId"
        :message-content-attributes="messageContentAttributes"
      />
    </div>
    <div v-if="isOptions">
      <chat-options
        :title="message"
        :options="messageContentAttributes.items"
        :hide-fields="!!messageContentAttributes.submitted_values"
        @click="onOptionSelect"
      >
      </chat-options>
    </div>
    <chat-form
      v-if="isForm && !messageContentAttributes.submitted_values"
      :items="messageContentAttributes.items"
      :button-label="messageContentAttributes.button_label"
      :submitted-values="messageContentAttributes.submitted_values"
      @submit="onFormSubmit"
    >
    </chat-form>
    <div v-if="isCards">
      <chat-card
        v-for="item in messageContentAttributes.items"
        :key="item.title"
        :media-url="item.media_url"
        :title="item.title"
        :description="item.description"
        :actions="item.actions"
      >
      </chat-card>
    </div>
    <div v-if="isArticle">
      <chat-article :items="messageContentAttributes.items"></chat-article>
    </div>
    <customer-satisfaction
      v-if="isCSAT"
      :message-content-attributes="messageContentAttributes.submitted_values"
      @submit="onCSATSubmit"
    />
  </div>
</template>

<script>
import messageFormatterMixin from 'shared/mixins/messageFormatterMixin';

export default {
  name: 'AgentMessageBubble',
  components: {
    ChatArticle: () =>
      import('./template/Article' /* webpackChunkName: "ChatArticle" */),
    ChatCard: () =>
      import('shared/components/ChatCard' /* webpackChunkName: "ChatCard" */),
    ChatForm: () =>
      import('shared/components/ChatForm' /* webpackChunkName: "ChatForm" */),
    ChatOptions: () =>
      import(
        'shared/components/ChatOptions' /* webpackChunkName: "ChatOptions" */
      ),
    EmailInput: () =>
      import('./template/EmailInput' /* webpackChunkName: "EmailInput" */),
    CustomerSatisfaction: () =>
      import(
        'shared/components/CustomerSatisfaction' /* webpackChunkName: "CustomerSatisfaction" */
      ),
  },
  mixins: [messageFormatterMixin],
  props: {
    message: { type: String, default: null },
    contentType: { type: String, default: null },
    messageType: { type: Number, default: null },
    messageId: { type: Number, default: null },
    messageContentAttributes: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isTemplate() {
      return this.messageType === 3;
    },
    isTemplateEmail() {
      return this.contentType === 'input_email';
    },
    isCards() {
      return this.contentType === 'cards';
    },
    isOptions() {
      return this.contentType === 'input_select';
    },
    isForm() {
      return this.contentType === 'form';
    },
    isArticle() {
      return this.contentType === 'article';
    },
    isCSAT() {
      return this.contentType === 'input_csat';
    },
  },
  methods: {
    onResponse(messageResponse) {
      this.$store.dispatch('message/update', messageResponse);
    },
    onOptionSelect(selectedOption) {
      this.onResponse({
        submittedValues: [selectedOption],
        messageId: this.messageId,
      });
    },
    onFormSubmit(formValues) {
      const formValuesAsArray = Object.keys(formValues).map(key => ({
        name: key,
        value: formValues[key],
      }));
      this.onResponse({
        submittedValues: formValuesAsArray,
        messageId: this.messageId,
      });
    },
    onCSATSubmit({ feedback, rating }) {
      this.onResponse({
        submittedValues: {
          csat_survey_response: {
            rating,
            feedback,
          },
        },
        messageId: this.messageId,
      });
    },
  },
};
</script>

<style lang="scss">
@import '~widget/assets/scss/variables.scss';

.chat-bubble {
  &.agent {
    background: $color-white;
    border-bottom-left-radius: $space-smaller;
    color: $color-body;

    .link {
      word-break: break-word;
      color: $color-woot;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '~widget/assets/scss/variables.scss';

.chat-bubble .message-content::v-deep pre {
  background: $color-primary-light;
  color: $color-body;
  overflow: scroll;
  padding: $space-smaller;
}
</style>
