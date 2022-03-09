// eslint-disable-next-line no-unused-vars
/* global axios */
import ApiClient from './ApiClient';

class BotsAPI extends ApiClient {
  constructor() {
    super('csml_bots', { accountScoped: true });
  }

  validate(botId) {
    return axios.post(`${this.url}/${botId}/validate`);
  }
}

export default new BotsAPI();
