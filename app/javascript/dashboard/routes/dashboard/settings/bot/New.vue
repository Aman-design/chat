<template>
  <div class="column content-box no-padding">
    <div class="row">
      <div class="small-8 columns">
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
            <div class="multiselect--wrap">
              <label>
                Select Inboxes to connect
              </label>
              <multiselect
                v-model="bot.inboxes"
                label="name"
                track-by="id"
                :options="inboxes"
                :multiple="true"
                :taggable="true"
              />
            </div>
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
export default {
  mixins: [alertMixin],
  validations: {
    bot: {
      name: { required },
      bot_config: { required },
    },
  },
  data() {
    return {
      bot: null,
    };
  },
  computed: {
    inboxes() {
      return this.$store.getters['inboxes/getInboxes'].map(i => ({
        name: i.name,
        id: i.id,
      }));
    },
  },
  mounted() {
    this.bot = {
      name: null,
      description: null,
      inboxes: [],
      bot_config: `start:
  say "Hello World! 👋"
  say Image("https://media4.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif")
  say Wait(1000)
  say Typing(1500)

/** You can find more about CSML format here: https://csml.dev/ */

goto end
`,
    };
  },
  methods: {
    async saveBot() {
      try {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        this.bot.inboxes = this.bot.inboxes.map(i => i.id);
        await this.$store.dispatch('bots/create', this.bot);
        this.showAlert('Bot created successfully');
        this.$router.back();
      } catch (error) {
        this.showAlert('Your csml configuration is invalid, please fix');
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
