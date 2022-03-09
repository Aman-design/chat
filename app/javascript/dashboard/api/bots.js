// eslint-disable-next-line no-unused-vars
/* global axios */
import ApiClient from './ApiClient';

class BotsAPI extends ApiClient {
  constructor() {
    super('csml_bots', { accountScoped: true });
  }

  getBotById(botId) {
    return axios.get(`${this.url}/${botId}`);
  }
}

export default new BotsAPI();
