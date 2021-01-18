/**
 * @type {Cypress.PluginConfig}
 */

import axios from "axios"

export default async (on, config) => {
  if (config.env.record) {
    const {
      data: { access_token },
    } = await axios.post(
      config.env.apiEndpoint + "/oauth/token?grant_type=client_credentials&client_id=" + config.env.clientId + "&scope=" + config.env.scope
    )
    config.env.accessToken = access_token
  } else {
    config.env.accessToken = "validToken"
  }
  return config
}
