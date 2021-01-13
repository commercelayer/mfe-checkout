/**
 * @type {Cypress.PluginConfig}
 */

import axios from "axios"

export default async (on, config) => {
  if (process.env.NODE_ENV === 'test' && config.env.record) {
    const {
      data: { access_token },
    } = await axios.post(
      config.env.apiEndpoint + "/oauth/token?grant_type=client_credentials&client_id=" + config.env.clientId + "&scope=market%3A3816"
    )
    config.env.accessToken = access_token
  }
  return config
}
