import type { AgentOptions } from "@newrelic/browser-agent/loaders/agent"

export function loadNewRelicAgent() {
  const env = process.env.NEXT_PUBLIC_STAGE as "DEV" | "STG" | "PRD"
  if (process.env[`NEXT_PUBLIC_NEWRELIC_LOADER_CONFIG_${env}`] == null) {
    return null
  }
  const options: AgentOptions = {
    init: {
      distributed_tracing: { enabled: true },
      privacy: { cookies_enabled: true },
      ajax: { deny_list: ["bam.eu01.nr-data.net"] },
    },
    info: JSON.parse(process.env[`NEXT_PUBLIC_NEWRELIC_INFO_${env}`] as string),
    loader_config: JSON.parse(
      process.env[`NEXT_PUBLIC_NEWRELIC_LOADER_CONFIG_${env}`] as string,
    ),
  }
  import("@newrelic/browser-agent/loaders/browser-agent").then(
    ({ BrowserAgent }) => {
      new BrowserAgent(options)
    },
  )
}
