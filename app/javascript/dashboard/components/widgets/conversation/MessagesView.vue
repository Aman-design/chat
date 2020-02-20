<template>
  <div class="view-box columns">
    <conversation-header
      :chat="currentChat"
      :is-contact-panel-open="isContactPanelOpen"
      @contactPanelToggle="onToggleContactPanel"
    />
    <ul class="conversation-panel">
      <transition name="slide-up">
        <li>
          <span v-if="shouldShowSpinner" class="spinner message" />
        </li>
      </transition>
      <div
        v-for="groupedReadMessages in getReadMessages"
        :key="groupedReadMessages.date + '-read'"
      >
        <date-separator :date="groupedReadMessages.date"></date-separator>
        <message
          v-for="message in groupedReadMessages.messages"
          :key="message.id"
          :data="message"
        />
      </div>
      <li v-show="getUnreadCount != 0" class="unread--toast">
        <span>
          {{ getUnreadCount }} UNREAD MESSAGE{{ getUnreadCount > 1 ? 'S' : '' }}
        </span>
      </li>

      <div
        v-for="groupedReadMessages in getUnReadMessages"
        :key="groupedReadMessages.date + '-unread'"
      >
        <date-separator :date="groupedReadMessages.date"></date-separator>
        <message
          v-for="message in groupedReadMessages.messages"
          :key="message.id"
          :data="message"
        />
      </div>
    </ul>
    <ReplyBox
      :conversation-id="currentChat.id"
      @scrollToMessage="focusLastMessage"
    />
  </div>
</template>

<script>
/* global bus */
import { mapGetters } from 'vuex';

import DateHelper from 'shared/helpers/DateHelper';
import DateSeparator from 'shared/components/DateSeparator.vue';
import ConversationHeader from './ConversationHeader';
import ReplyBox from './ReplyBox';
import Message from './Message';
import conversationMixin from '../../../mixins/conversations';

const groupBy = require('lodash.groupby');

export default {
  components: {
    DateSeparator,
    ConversationHeader,
    Message,
    ReplyBox,
  },

  mixins: [conversationMixin],

  props: {
    inboxId: {
      type: [Number, String],
      required: true,
    },
    isContactPanelOpen: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isLoadingPrevious: true,
      heightBeforeLoad: null,
      conversationPanel: null,
    };
  },

  computed: {
    ...mapGetters({
      currentChat: 'getSelectedChat',
      allConversations: 'getAllConversations',
      inboxesList: 'inboxes/getInboxes',
      listLoadingStatus: 'getAllMessagesLoaded',
      getUnreadCount: 'getUnreadCount',
      loadingChatList: 'getChatListLoadingStatus',
    }),

    getMessages() {
      const [chat] = this.allConversations.filter(
        c => c.id === this.currentChat.id
      );
      return chat;
    },

    getReadMessages() {
      const chat = this.getMessages;
      return chat === undefined
        ? null
        : this.getGroupedConversation(this.readMessages(chat));
    },
    getUnReadMessages() {
      const chat = this.getMessages;
      return chat === undefined
        ? null
        : this.getGroupedConversation(this.unReadMessages(chat));
    },
    shouldShowSpinner() {
      return (
        this.getMessages.dataFetched === undefined ||
        (!this.listLoadingStatus && this.isLoadingPrevious)
      );
    },

    shouldLoadMoreChats() {
      return !this.listLoadingStatus && !this.isLoadingPrevious;
    },
  },

  created() {
    bus.$on('scrollToMessage', () => {
      this.focusLastMessage();
      this.makeMessagesRead();
    });
  },

  methods: {
    getGroupedConversation: messages => {
      const messagesGroupedByDate = groupBy(Object.values(messages), message =>
        new DateHelper(message.created_at).format()
      );
      return Object.keys(messagesGroupedByDate).map(date => {
        const groupedMessages = messagesGroupedByDate[date].map(
          (message, index) => {
            let showAvatar = false;
            if (index === messagesGroupedByDate[date].length - 1) {
              showAvatar = true;
            } else {
              const nextMessage = messagesGroupedByDate[date][index + 1];
              const currentSender = message.sender ? message.sender.name : '';
              const nextSender = nextMessage.sender
                ? nextMessage.sender.name
                : '';
              showAvatar =
                currentSender !== nextSender ||
                message.message_type !== nextMessage.message_type;
            }
            return { showAvatar, ...message };
          }
        );

        return {
          date,
          messages: groupedMessages,
        };
      });
    },
    focusLastMessage() {
      setTimeout(() => {
        this.attachListner();
      }, 0);
    },

    onToggleContactPanel() {
      this.$emit('contactPanelToggle');
    },

    attachListner() {
      this.conversationPanel = this.$el.querySelector('.conversation-panel');
      this.heightBeforeLoad =
        this.getUnreadCount === 0
          ? this.conversationPanel.scrollHeight
          : this.$el.querySelector('.conversation-panel .unread--toast')
              .offsetTop - 56;
      this.conversationPanel.scrollTop = this.heightBeforeLoad;
      this.conversationPanel.addEventListener('scroll', this.handleScroll);
      this.isLoadingPrevious = false;
    },

    handleScroll(e) {
      const dataFetchCheck =
        this.getMessages.dataFetched === true && this.shouldLoadMoreChats;
      if (
        e.target.scrollTop < 100 &&
        !this.isLoadingPrevious &&
        dataFetchCheck
      ) {
        this.isLoadingPrevious = true;
        this.$store
          .dispatch('fetchPreviousMessages', {
            conversationId: this.currentChat.id,
            before: this.getMessages.messages[0].id,
          })
          .then(() => {
            this.conversationPanel.scrollTop =
              this.conversationPanel.scrollHeight -
              (this.heightBeforeLoad - this.conversationPanel.scrollTop);
            this.isLoadingPrevious = false;
            this.heightBeforeLoad =
              this.getUnreadCount === 0
                ? this.conversationPanel.scrollHeight
                : this.$el.querySelector('.conversation-panel .unread--toast')
                    .offsetTop - 56;
          });
      }
    },

    makeMessagesRead() {
      if (this.getUnreadCount !== 0 && this.getMessages !== undefined) {
        this.$store.dispatch('markMessagesRead', {
          id: this.currentChat.id,
          lastSeen: this.getMessages.messages.last().created_at,
        });
      }
    },
  },
};
</script>
