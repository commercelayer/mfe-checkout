# Adyen express checkout — prototype

Apple Pay and Google Pay buttons in the checkout sidebar, built directly on the
Adyen web SDK and the Commerce Layer SDK rather than on the
`@commercelayer/react-components` payment components.

**This is prototype code.** It exists to prove the flow works end to end and to
be read as a reference. It is not production-ready — see *What this leaves out*
before building on it.

## Why not the payment components

`<PaymentMethodsContainer>` and the Adyen payment source render a Drop-in inside
the payment step, which is the right tool for a conventional checkout. Express
has a different shape:

- **It inverts the checkout.** The shopper pays first and the address arrives
  afterwards, from the wallet.
- **The wallet callbacks need a seam.** Apple Pay's `onShippingContactSelected`
  and Google Pay's `onPaymentDataChanged` have to update the order mid-sheet and
  answer with new totals.
- **The button lives outside the payment step** — in the order summary, or on a
  cart page.

So this flow drops one level down. Everything else in the checkout stays on the
React components.

## Status

| | |
|---|---|
| Google Pay, Chrome | works end to end — sheet, addresses, shipping, authorization, order placed |
| Apple Pay | not yet exercised: `localhost` is not a domain registered with Adyen, so `isAvailable()` skips it. Needs a tunnel on a registered domain |
| 3DS / redirect actions | wired, not yet exercised — wallets rarely trigger an `action` |

## Running it

```
pnpm dev
```

Open a checkout url with `?express=true`:

```
http://localhost:3000/:orderId?accessToken=:token&express=true
```

Without the flag nothing renders and the checkout behaves exactly as today.

The buttons need an order with an Adyen payment method available, plus a browser
that can pay: Chrome with a card in Google Pay, or Safari on a Mac/iPhone with a
card in Wallet and a domain registered with Adyen. A wallet that isn't usable is
skipped — the panel at the bottom-left says which, and narrates every step of
the flow. That panel is prototype furniture and goes away with this folder.

## How it works

1. **Start the session** — find the Adyen method among the order's available
   payment methods, select it, and create the `adyen_payments` source. That
   source carries the Adyen client key and the payment methods enabled for this
   order's country and amount.
2. **Mount the wallets** — `AdyenCheckout` in advanced flow, then `ApplePay` and
   `GooglePay` elements with `isExpress: true`. `isAvailable()` decides what
   renders.
3. **Answer the sheet** — the wallet provides a redacted address; save it, apply
   a shipping method to every shipment, and resolve the callback with the
   recomputed total, line items and shipping options.
4. **Take the authorized contact** — on authorization the wallet provides the
   real email, shipping and billing contact. Fill them into the same address
   record created on the first callback.
5. **Authorize and place** — `payment_request_data` and `_authorize` on the
   payment source, then `_place` on the order.

Files: `useAdyenExpress.ts` (the flow), `expressOrder.ts` (Commerce Layer calls),
`utils.ts` (wallet → address mapping, totals, browser info), `index.tsx` and
`styled.tsx` (buttons and the panel).

## Guidelines

Four things worth building in from the start. Each follows from how the platform
and the wallet SDKs behave, and each is applied in this code.

**Keep one address record and update it in place.** Attaching an address to the
order recreates the shipments, and the shipping method goes with them. Updating
the record the order already points at keeps both, so the shopper's choice
survives from the wallet sheet through to placement. Orders autorefresh, so
`_refresh` isn't needed — and it recreates the shipments too. Repeat edits in
the sheet then cost two calls rather than five or six.

**Validate the shipping method against availability before placing.**
Availability is recalculated from the shipping zone whenever the location
changes, so an address outside the zone leaves the shipment unservable. Check
that each shipment's `shipping_method` is still among its
`available_shipping_methods` after the authorization write —
`hasUnservedShipment` does this — and stop rather than placing an order that
cannot ship.

**Read `payment_response.resultCode` to know whether a payment was attempted.**
A newly created `adyen_payments` source carries `payment_response: {}`, so its
presence alone does not mean a payment is in flight.

**Give required address fields a value while the wallet withholds them.** During
the sheet you get country, city, postcode and region — not street or name — so
placeholders let taxes and shipping compute, and the real values replace them at
authorization. Markets that require billing info need it on every address,
including the copy made by `_billing_address_same_as_shipping`.

## What this leaves out

- **Copy is hardcoded English.** No i18n, deliberately.
- **Selecting Adyen at init is a visible side effect**: the payment step shows
  Adyen preselected even if the shopper never uses express. Production wants a
  lazy start, or a way to obtain the client key without touching the order.
- **Billing info is a fixed placeholder** (`PROTOTYPE_BILLING_INFO`). Production
  has to collect it from the shopper, which is worth weighing against express's
  one-tap promise.
- **Per-country address validation** is not handled.
- **Shipping methods are matched by name** across shipments, and the price shown
  in the sheet is the sum of the same-named method on each one.
- **No tests, and no error recovery** beyond showing a message and letting the
  shopper fall back to the payment step.
- Guest vs. logged-in differences (saving to wallet, stored methods) are ignored.
