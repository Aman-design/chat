<template>
  <div class="column content-box">
    <div class="row">
      <div class="small-8 columns with-right-space">
        <table class="woot-table">
          <thead>
            <th v-for="thHeader in $t('BOT.LIST.TABLE_HEADER')" :key="thHeader">
              {{ thHeader }}
            </th>
          </thead>
          <tbody>
            <tr v-for="(bot, index) in records" :key="index">
              <td>
                <router-link :to="`bot/${index}`">{{ bot.name }}</router-link>
              </td>
              <td>{{ bot.description }}</td>
              <td>
                <button
                  type="button"
                  class="toggle-button"
                  :class="{ active: bot.active }"
                  role="switch"
                  :aria-checked="bot.active.toString()"
                >
                  <span
                    aria-hidden="true"
                    :class="{ active: bot.active }"
                  ></span>
                </button>
              </td>
              <td>{{ bot.created_on }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="small-4 columns content-box">
        <span v-html="$t('BOT.SIDEBAR_TXT')"></span>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque,
          exercitationem porro. Aperiam itaque vero, illum sapiente illo eveniet
          explicabo impedit blanditiis et, odio quidem! Animi unde earum minima
          harum! Rerum?
        </p>
      </div>
    </div>
    <woot-button
      color-scheme="success"
      class-names="button--fixed-right-top"
      icon="add-circle"
    >
      Configure new bot
    </woot-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      records: [
        {
          name: 'Ultron',
          description: 'This is some random test bot',
          active: true,
          created_on: 'Tue 8 Mar, 2022',
        },
        {
          name: 'Super bot',
          description: 'This is some random test bot',
          active: true,
          created_on: 'Mon 12 Feb, 2022',
        },
        {
          name: 'Wall e',
          description: 'This is some random test bot',
          active: true,
          created_on: 'Sub 18 Dec, 2022',
        },
        {
          name: 'Test Bot 32',
          description: 'This is some random test bot',
          active: true,
          created_on: 'Wed 10 Mar, 2022',
        },
      ],
    };
  },
};
</script>
<style scoped>
.bots-list {
  list-style: none;
}
.toggle-button {
  background-color: var(--s-200);
  position: relative;
  display: inline-flex;
  height: 19px;
  width: 34px;
  border: 2px solid transparent;
  border-radius: var(--border-radius-large);
  cursor: pointer;
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  flex-shrink: 0;
}

.toggle-button.active {
  background-color: var(--w-500);
}

.toggle-button span {
  --space-one-point-five: 1.5rem;
  height: var(--space-one-point-five);
  width: var(--space-one-point-five);
  display: inline-block;
  background-color: var(--white);
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
    rgba(59, 130, 246, 0.5) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  transform: translate(0, 0);
  border-radius: 100%;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
.toggle-button span.active {
  transform: translate(var(--space-one-point-five), var(--space-zero));
}
</style>
