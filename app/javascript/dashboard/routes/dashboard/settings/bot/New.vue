<template>
  <div class="column content-box no-padding">
    <div class="row">
      <div class="small-8 columns">
        <csml-monaco-editor v-model="csmlCode" class="bot-editor full-height" />
      </div>
      <div class="small-4 columns content-box full-height">
        <form class="details-editor" @submit.prevent="submit">
          <div>
            <label>
              Bot Name
              <input type="text" placeholder="Give your bot a name" />
              <!-- <span v-if="true" class="message">
            Error
          </span> -->
            </label>
            <label>
              Description
              <textarea
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
export default {
  data() {
    return {
      csmlCode: `start:
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
    submit() {
      console.log('Submuit');
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
}
.details-editor {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
