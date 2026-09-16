/**
 * PROTOTYPE — throwaway code, see README.md
 *
 * Apple Pay / Google Pay express buttons in the checkout sidebar, built
 * straight on the Adyen web SDK and the Commerce Layer SDK. Opt in per order
 * by adding `?express=true` to the checkout url, so nothing changes for a
 * normal checkout.
 */
import "@adyen/adyen-web/styles/adyen.css"
import type { AppProviderData } from "components/data/AppProvider"
import { useSearchParams } from "react-router-dom"

import {
  ExpressButtons,
  ExpressError,
  ExpressHint,
  ExpressTitle,
  ExpressWrapper,
  PanelDetail,
  PanelHeader,
  PanelRow,
  PanelTime,
  PanelWrapper,
} from "./styled"
import { useAdyenExpress } from "./useAdyenExpress"

interface Props {
  appCtx: AppProviderData
}

export const PrototypeAdyenExpress: React.FC<Props> = ({ appCtx }) => {
  const [searchParams] = useSearchParams()

  if (searchParams.get("express") !== "true") {
    return null
  }

  return <ExpressCheckout appCtx={appCtx} />
}

const ExpressCheckout: React.FC<Props> = ({ appCtx }) => {
  const { status, error, wallets, events, applePayRef, googlePayRef } =
    useAdyenExpress({ appCtx })

  const hasWallets = wallets.length > 0

  return (
    <>
      <ExpressWrapper
        data-testid="adyen-express-checkout"
        isEmpty={!hasWallets}
        aria-busy={status === "processing"}
      >
        {hasWallets && <ExpressTitle>Express checkout</ExpressTitle>}
        <ExpressButtons>
          <div ref={applePayRef} data-testid="adyen-express-applepay" />
          <div ref={googlePayRef} data-testid="adyen-express-googlepay" />
        </ExpressButtons>
        {status === "processing" && (
          <ExpressHint data-testid="adyen-express-processing">
            Completing your order…
          </ExpressHint>
        )}
        {error != null && (
          <ExpressError data-testid="adyen-express-error">{error}</ExpressError>
        )}
      </ExpressWrapper>
      <FlowPanel status={status} wallets={wallets} events={events} />
    </>
  )
}

/** Prototype-only: shows what the integration is doing, step by step. */
const FlowPanel: React.FC<
  Pick<ReturnType<typeof useAdyenExpress>, "status" | "wallets" | "events">
> = ({ status, wallets, events }) => (
  <PanelWrapper data-testid="adyen-express-panel">
    <PanelHeader>
      <span>adyen express · prototype</span>
      <span>
        {status}
        {wallets.length > 0 ? ` · ${wallets.join(", ")}` : ""}
      </span>
    </PanelHeader>
    {events.length === 0 ? (
      <PanelRow>
        <PanelDetail>waiting for the order…</PanelDetail>
      </PanelRow>
    ) : (
      events.map((event, index) => (
        <PanelRow key={`${event.at}-${index}`}>
          <PanelTime>{event.at}</PanelTime>
          <span>{event.step}</span>
          {event.detail != null && <PanelDetail>{event.detail}</PanelDetail>}
        </PanelRow>
      ))
    )}
  </PanelWrapper>
)
