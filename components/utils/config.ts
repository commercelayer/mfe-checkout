interface ConfigParams {
  lang?: NullableType<string>
  accessToken?: string
  orderId?: string
}

export function getConfig(
  jsonConfig: { mfe: Configs },
  key: string,
  params: ConfigParams
): DefaultConfig | null {
  if (!jsonConfig.mfe) {
    console.warn("No configuration found.")
    return null
  }

  const defaultConfig = jsonConfig?.mfe?.default
  const overrideConfig = jsonConfig?.mfe[key] || {}

  // Deep merge function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function mergeDeep(target: any, source: any): any {
    for (const key in source) {
      if (source[key] instanceof Array) {
        target[key] = source[key].length > 0 ? source[key] : target[key]
      } else if (typeof source[key] === "object" && source[key] !== null) {
        if (!target[key]) target[key] = {}
        mergeDeep(target[key], source[key])
      } else {
        target[key] = source[key]
      }
    }
    return target
  }

  // Replace placeholders in all string values within the object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function replacePlaceholders(config: any): any {
    Object.keys(config).forEach((key) => {
      if (typeof config[key] === "string") {
        config[key] = config[key]
          .replace(/:lang/g, params.lang || "")
          .replace(/:access_token/g, params.accessToken || "")
          .replace(/:order_id/g, params.orderId || "")
      } else if (typeof config[key] === "object" && config[key] !== null) {
        replacePlaceholders(config[key])
      }
    })
    return config
  }

  const mergedConfig = mergeDeep(
    JSON.parse(JSON.stringify(defaultConfig)),
    overrideConfig
  )
  return replacePlaceholders(mergedConfig)
}
