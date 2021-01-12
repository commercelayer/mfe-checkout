/**
 * @type {Cypress.PluginConfig}
 */

import axios from "axios";

export default (on, config) => {
  on('task', {
    async "setAccessTokenTest"() {
      const { data: { access_token } } = await axios.post('https://checkout-test.commercelayer.io/oauth/token?grant_type=client_credentials&client_id=HAA9HFHyqF-AUroyzK5jrXMX-zPrmEWK1kq9pj56jww&scope=market%3A3816');
      config.env.sharedSecret = access_token
      return config
    },
  })

  return config
}