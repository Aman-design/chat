<template>
  <div class="column content-box">
    <div class="row">
      <div class="small-8 columns with-right-space">
        <p
          v-if="!uiFlags.isFetching && !records.length"
          class="no-items-error-message"
        >
          No Bots found, please create by clicking the "Configure New Bot"
          Button ↗
        </p>
        <woot-loading-state v-if="uiFlags.isFetching" message="Fetching Bots" />
        <table v-if="!uiFlags.isFetching && records.length" class="woot-table">
          <thead>
            <th v-for="thHeader in $t('BOT.LIST.TABLE_HEADER')" :key="thHeader">
              {{ thHeader }}
            </th>
          </thead>
          <tbody>
            <tr v-for="(bot, index) in records" :key="index">
              <td class="nowrap">
                <router-link :to="`bot/${bot.id}`">{{ bot.name }}</router-link>
              </td>
              <td>{{ bot.description || '---' }}</td>
              <td class="button-wrapper">
                <woot-button
                  v-tooltip.top="'Delete Bot'"
                  variant="smooth"
                  color-scheme="alert"
                  size="tiny"
                  icon="dismiss-circle"
                  class-names="grey-btn"
                  :is-loading="loading[bot.id]"
                  @click="deleteBot(bot.id)"
                >
                </woot-button>
              </td>
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
      <router-link to="bot/new" class="white-text">
        Configure new bot
      </router-link>
    </woot-button>
    <woot-confirm-modal
      ref="confirmDialog"
      title="Delete Bot"
      description="Are you sure you want to delete this bot? This action is irreversible"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: {},
    };
  },
  computed: {
    ...mapGetters({
      records: ['bots/getBots'],
      uiFlags: 'bots/getUIFlags',
    }),
  },
  mounted() {
    this.$store.dispatch('bots/get');
  },
  methods: {
    async deleteBot(id) {
      const ok = await this.$refs.confirmDialog.showConfirmation();
      if (ok) {
        await await this.$store.dispatch('bots/delete', id);
        this.showAlert('Bot deleted');
      }
    },
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

.nowrap {
  white-space: nowrap;
}
.white-text {
  color: white;
}
</style>
