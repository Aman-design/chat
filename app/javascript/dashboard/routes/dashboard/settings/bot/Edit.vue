<template>
  <div class="column content-box no-padding">
    <div class="row">
      <div class="small-9 columns with-right-space">
        <csml-monaco-editor v-model="csmlCode" class="bot-editor" />
      </div>
      <div class="small-3 columns content-box">
        <h2 class="page-sub-title">Test Bot</h2>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi sit
          alias itaque nam doloremque dicta modi, repellat ipsa odit quia
          corrupti quas officiis libero incidunt id atque corporis ea sunt.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      csmlCode: `start:
  say "Hello stranger! 👋"
  say Image("https://media4.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif")
  say Wait(1000)
  say Typing(1500)

say QuickReply(
  "Let me show you how CSML Playground works!",
  buttons=[Button("Go")]
)

hold

if (event != "Go") {
  say "You didn't click on Go but let's do it anyway 😉"
}

say "CSML is a programming language dedicated to building rich chatbots very easily."
say Url("https://www.csml.dev", text="👉 More infos")
say Wait(3000) // wait for 3 seconds
say Typing(1500) // display a typing indicator for 1.5s
goto instructions

instructions:
say QuickReply(
You can edit the code 👩‍💻 on the left to create your own chatbot!",
buttons=[Button("Ok!"), Button("Cool! 😎")]
)

hold

say QuickReply(
To get started, here are some instructions for you:
- When you are ready, you can click on **Build** at the top of the page.
- You can also add new flows by clicking on the ➕ sign in the left sidebar!
- To share your work with others, click on **Share** 🙌 to send it to friends and colleagues.",
buttons=[Button("Got it!")]
)

hold

say "👉 You can also sign up **for free** to CSML Studio to use integrations ⚡️ like Zapier or Airtable, and deploy 🚀 your chatbot on Messenger, Whatsapp or Slack!"
say Typing(4000)
say "Enjoy ❤️"
goto end
`,
    };
  },
};
</script>

<style scoped>
.no-padding {
  padding: 0 !important;
}
.bot-editor {
  height: calc(100vh - 56px);
  width: 100%;
}
</style>
