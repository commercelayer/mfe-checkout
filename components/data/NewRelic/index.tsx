import type { AgentOptions } from "@newrelic/browser-agent/loaders/agent"

const NR_LOADER_CONFIG = {
  DEV: process.env.NEXT_PUBLIC_NEWRELIC_LOADER_CONFIG_DEV,
  STG: process.env.NEXT_PUBLIC_NEWRELIC_LOADER_CONFIG_STG,
  PRD: process.env.NEXT_PUBLIC_NEWRELIC_LOADER_CONFIG_PRD,
}

const NR_LOADER_INFO = {
  DEV: process.env.NEXT_PUBLIC_NEWRELIC_INFO_DEV,
  STG: process.env.NEXT_PUBLIC_NEWRELIC_INFO_STG,
  PRD: process.env.NEXT_PUBLIC_NEWRELIC_INFO_PRD,
}

export function loadNewRelicAgent() {
  const env = process.env.NEXT_PUBLIC_STAGE as keyof typeof NR_LOADER_INFO
  if (NR_LOADER_CONFIG[env] == null) {
    return null
  }
  const options: AgentOptions = {
    init: {
      distributed_tracing: { enabled: true },
      privacy: { cookies_enabled: true },
      ajax: { deny_list: ["bam.eu01.nr-data.net"] },
    },
    info: JSON.parse(NR_LOADER_INFO[env] as string),
    loader_config: JSON.parse(NR_LOADER_CONFIG[env] as string),
  }

  import("@newrelic/browser-agent/loaders/browser-agent").then(
    ({ BrowserAgent }) => {
      new BrowserAgent(options)
    },
  )
}
