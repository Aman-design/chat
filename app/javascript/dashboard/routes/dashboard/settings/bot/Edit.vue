<template>
  <div class="column content-box no-padding">
    <div class="row">
      <woot-loading-state v-if="uiFlags.isFetching" message="Fetching Bots" />
      <div v-if="bot" class="small-8 columns">
        <div class="full-height editor-wrapper">
          <csml-monaco-editor v-model="bot.bot_config" class="bot-editor" />
          <div v-if="$v.bot.bot_config.$error" class="editor-error-message">
            <span>Where is your code?</span>
          </div>
        </div>
      </div>
      <div class="small-4 columns content-box full-height">
        <form class="details-editor" @submit.prevent="saveBot">
          <div>
            <label :class="{ error: $v.bot.name.$error }">
              Bot Name
              <input
                v-model="bot.name"
                type="text"
                placeholder="Give your bot a name"
              />
              <span v-if="$v.bot.name.$error" class="message">
                Please enter a valid name
              </span>
            </label>
            <label>
              Description
              <textarea
                v-model="bot.description"
                rows="4"
                placeholder="What does this bot do?"
              ></textarea>
            </label>
          </div>
          <woot-button>Validate and save</woot-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import alertMixin from 'shared/mixins/alertMixin';
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

export default {
  mixins: [alertMixin],
  data() {
    return {
      bot: null,
      allInboxes: [],
    };
  },
  validations: {
    bot: {
      name: { required },
      bot_config: { required },
    },
  },
  computed: {
    ...mapGetters({
      uiFlags: 'bots/getUIFlags',
    }),
  },
  mounted() {
    this.allInboxes = this.$store.getters['inboxes/getInboxes'].map(i => ({
      name: i.name,
      id: i.id,
    }));
    this.$store
      .dispatch('bots/getBotById', this.$route.params.botId)
      .then(bot => {
        this.bot = bot;
        // this.box.inboxes = this.allInboxes.filter(i =>
        //   this.bot.inboxes.includes(i.id)
        // );
      });
  },
  methods: {
    async saveBot() {
      try {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        await this.$store.dispatch('bots/update', this.bot);
        this.showAlert('Bot updated successfully');
      } catch (error) {
        this.showAlert(error);
      }
    },
  },
};
</script>

<style scoped>
.no-padding {
  padding: 0 !important;
}
.full-height {
  height: calc(100vh - 56px);
}

.bot-editor {
  width: 100%;
  height: 100%;
}
.details-editor {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.editor-wrapper {
  position: relative;
}
.editor-error-message {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  background-color: #e0bbbb;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  justify-content: center;
  flex-shrink: 0;
}
</style>
