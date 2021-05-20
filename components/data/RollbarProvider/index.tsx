import { Provider, ErrorBoundary } from "@rollbar/react"
import { Fragment } from "react"

export const RollbarProvider: React.FC = ({ children }) => {
  console.log("rollbar", process.env.NEXT_ROLLBAR_ACCESS_TOKEN)
  if (!process.env.NEXT_ROLLBAR_ACCESS_TOKEN) {
    console.log("starting rollbar", process.env.NEXT_ROLLBAR_ACCESS_TOKEN)
    return <Fragment>{children}</Fragment>
  }

  const rollbarConfig = {
    accessToken: process.env.NEXT_ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: "production",
    },
  }

  return (
    <Fragment>
      <Provider config={rollbarConfig}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </Provider>
    </Fragment>
  )
}
