/**
 * PROTOTYPE — throwaway code, see README.md
 *
 * Drives Apple Pay / Google Pay straight from the Adyen web SDK and talks to
 * Commerce Layer with the plain SDK: no `@commercelayer/react-components`
 * anywhere in this flow.
 */

import type { ICore, UIElement } from "@adyen/adyen-web"
import { AdyenCheckout, ApplePay, GooglePay } from "@adyen/adyen-web"
import {
  type AdyenPayment,
  CommerceLayer,
  type Order,
} from "@commercelayer/sdk"
import type { AppProviderData } from "components/data/AppProvider"
import { useEffect, useRef, useState } from "react"

import {
  applyShippingMethod,
  authorizeAdyenPayment,
  createAdyenPaymentSource,
  fetchExpressOrder,
  findAdyenPaymentMethod,
  hasUnservedShipment,
  listShippingMethods,
  placeExpressOrder,
  saveCustomerEmail,
  saveExpressBillingAddress,
  saveExpressShippingAddress,
  sendAdyenPaymentDetails,
  updatePaymentRequestData,
} from "./expressOrder"
import type {
  ExpressContact,
  ExpressEvent,
  ExpressShippingMethod,
  ExpressStatus,
  ExpressTotals,
} from "./types"
import {
  adyenEnvironment,
  browserInfo,
  contactFromApplePay,
  contactFromGooglePay,
  expressAmount,
  expressCountryCode,
  expressTotals,
  returnUrl,
} from "./utils"

const SUCCESS_RESULT_CODES = ["Authorised", "Pending", "Received"]

const COPY = {
  error:
    "We couldn't complete your express payment. Please try again or choose a payment method below.",
  noShippingMethods: "We can't ship to the selected address.",
}

// Wallet sheets show these next to the amounts.
const TOTALS_LABELS = {
  total: "Total",
  subtotal: "Subtotal",
  discount: "Discount",
  shipping: "Shipping",
  taxes: "Tax",
  giftCard: "Gift card",
}

interface Props {
  appCtx: AppProviderData
}

interface UseAdyenExpress {
  status: ExpressStatus
  error: NullableType<string>
  wallets: string[]
  events: ExpressEvent[]
  applePayRef: React.RefObject<HTMLDivElement>
  googlePayRef: React.RefObject<HTMLDivElement>
}

export function useAdyenExpress({ appCtx }: Props): UseAdyenExpress {
  const [status, setStatus] = useState<ExpressStatus>("idle")
  const [error, setError] = useState<NullableType<string>>()
  const [wallets, setWallets] = useState<string[]>([])
  const [events, setEvents] = useState<ExpressEvent[]>([])

  const applePayRef = useRef<HTMLDivElement>(null)
  const googlePayRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)
  const orderRef = useRef<Order>()
  const paymentSourceRef = useRef<AdyenPayment>()
  const shippingMethodRef = useRef<string>()
  const elementsRef = useRef<UIElement[]>([])

  const {
    accessToken,
    slug,
    domain,
    orderId,
    isFirstLoading,
    isComplete,
    isPaymentRequired,
    hasPaymentMethod,
    isShipmentRequired,
  } = appCtx

  const canStart =
    !isFirstLoading && !isComplete && isPaymentRequired && !hasPaymentMethod

  // The express session is created once per order, so the effect deliberately
  // depends only on what can invalidate it.
  useEffect(() => {
    if (!canStart || isInitialized.current) {
      return
    }
    isInitialized.current = true

    const cl = CommerceLayer({ organization: slug, accessToken, domain })

    /** Everything the prototype does shows up in the panel. */
    const log = (step: string, detail?: string) => {
      setEvents((current) => [
        ...current,
        { at: new Date().toLocaleTimeString(), step, detail },
      ])
    }

    const syncOrder = (order: Order) => {
      orderRef.current = order
      return order
    }

    const currentOrder = () => orderRef.current as Order

    const paymentSourceId = () =>
      currentOrder().payment_source?.id ??
      (paymentSourceRef.current?.id as string)

    const totals = (order: Order): ExpressTotals =>
      expressTotals(order, TOTALS_LABELS)

    /** What the shipments actually carry after we patched them. */
    const logShipments = (order: Order) => {
      const shipments = order.shipments ?? []

      log(
        "shipments",
        shipments.length === 0
          ? "none on the order"
          : shipments
              .map(
                (shipment) =>
                  `${shipment.id}: ${shipment.shipping_method?.name ?? "nil"} of ${
                    (shipment.available_shipping_methods ?? []).length
                  }`,
              )
              .join(" · "),
      )
    }

    /**
     * Saves what the wallet knows about the shopper so far and re-prices the
     * order, so the sheet can show real shipping costs and taxes.
     */
    const applyShippingContact = async (contact: ExpressContact) => {
      log("shipping contact", `${contact.city ?? "?"}, ${contact.countryCode}`)

      // Google Pay fires the first callback before the shopper has picked an
      // address: without a country there is nothing to save, so just price
      // what we already have.
      let order = contact.countryCode
        ? await saveExpressShippingAddress(cl, {
            order: currentOrder(),
            contact,
          })
        : currentOrder()
      order = await applyShippingMethod(cl, {
        order,
        identifier: shippingMethodRef.current,
      })
      // Keep what the shopper picked if the new address still offers it,
      // otherwise fall back to the first method — which is what the shipments
      // were just patched with anyway.
      const methods = listShippingMethods(order)
      const isStillOffered = methods.some(
        (method) => method.identifier === shippingMethodRef.current,
      )
      shippingMethodRef.current = isStillOffered
        ? shippingMethodRef.current
        : methods[0]?.identifier

      log(
        "order repriced",
        `${methods.length} methods · shipping ${order.shipping_amount_float ?? 0}`,
      )
      logShipments(order)

      return { order: syncOrder(order), methods }
    }

    const selectShippingMethod = async (identifier: string) => {
      shippingMethodRef.current = identifier
      const order = await applyShippingMethod(cl, {
        order: currentOrder(),
        identifier,
      })
      // The shipments have been patched: the panel shows the price the order
      // actually carries now, not the one the wallet sheet asked for.
      log(
        "shipments patched",
        `${identifier} · shipping ${order.shipping_amount_float ?? 0} · total ${
          order.total_amount_with_taxes_float ?? 0
        }`,
      )
      logShipments(order)

      return syncOrder(order)
    }

    /** Stores the definitive contact data handed over on authorization. */
    const applyAuthorizedContacts = async ({
      email,
      shipping,
      billing,
    }: {
      email?: NullableType<string>
      shipping?: NullableType<ExpressContact>
      billing?: NullableType<ExpressContact>
    }) => {
      if (email) {
        syncOrder(await saveCustomerEmail(cl, { order: currentOrder(), email }))
      }
      if (isShipmentRequired && shipping) {
        syncOrder(
          await saveExpressShippingAddress(cl, {
            order: currentOrder(),
            contact: shipping,
          }),
        )
      }
      if (billing ?? shipping) {
        syncOrder(
          await saveExpressBillingAddress(cl, {
            order: currentOrder(),
            contact: {
              ...(billing ?? shipping),
              email: email ?? billing?.email ?? shipping?.email,
              phone: billing?.phone ?? shipping?.phone,
            },
          }),
        )
      }
      log("addresses saved", email ?? undefined)

      // Updating the address in place keeps the method, but the first write of
      // the flow attaches a new address and so recreates the shipments. This
      // keeps the shopper's choice applied either way.
      syncOrder(
        await applyShippingMethod(cl, {
          order: currentOrder(),
          identifier: shippingMethodRef.current,
        }),
      )
      logShipments(currentOrder())

      // Shipping was quoted against a redacted location, and the real address
      // can fall in a different shipping zone. Confirm the order can still be
      // served before placing it.
      if (isShipmentRequired && hasUnservedShipment(currentOrder())) {
        throw new Error(COPY.noShippingMethods)
      }
    }

    const completeOrder = async () => {
      const placed = await placeExpressOrder(cl, currentOrder().id)
      log("order placed", placed.status)
      setStatus("placed")
      await appCtx.placeOrder(placed)
    }

    const failWith = (message?: NullableType<string>) => {
      log("failed", message ?? undefined)
      setError(message || COPY.error)
      setStatus("ready")
    }

    /**
     * Authorizes the payment on Commerce Layer with the wallet token collected
     * by Adyen, then places the order. Same calls the Adyen drop-in makes in
     * the payment step, issued by hand.
     */
    const onSubmit = async (
      state: { data: Record<string, any> },
      _element: UIElement,
      actions: {
        resolve: (response: any) => void
        reject: (error?: any) => void
      },
    ) => {
      setError(undefined)
      setStatus("processing")
      log("authorizing", state.data?.paymentMethod?.type)

      try {
        const { paymentMethod, ...paymentData } = state.data

        await updatePaymentRequestData(cl, {
          paymentSourceId: paymentSourceId(),
          paymentRequestData: {
            ...paymentData,
            payment_method: paymentMethod,
            return_url: returnUrl(),
            origin: window.location.origin,
            redirect_from_issuer_method: "GET",
            shopperInteraction: "Ecommerce",
            browser_info: browserInfo(),
          },
        })

        const authorized = await authorizeAdyenPayment(cl, paymentSourceId())
        const { resultCode, action, refusalReason } =
          authorized.payment_response ?? {}
        log("adyen result", resultCode)

        if (action != null) {
          // Let the Adyen element run the extra step (3DS, redirect, …) and
          // come back through `onAdditionalDetails`.
          actions.resolve({ resultCode, action })
          return
        }

        if (SUCCESS_RESULT_CODES.includes(resultCode)) {
          actions.resolve({ resultCode })
          await completeOrder()
          return
        }

        actions.reject()
        failWith(refusalReason)
      } catch (e) {
        console.error("Adyen express prototype: payment failed", e)
        actions.reject()
        failWith()
      }
    }

    const onAdditionalDetails = async (
      state: { data: Record<string, any> },
      _element: UIElement,
      actions: {
        resolve: (response: any) => void
        reject: (error?: any) => void
      },
    ) => {
      try {
        const details = await sendAdyenPaymentDetails(cl, {
          paymentSourceId: paymentSourceId(),
          details: state.data,
        })
        const { resultCode, refusalReason } = details.payment_response ?? {}
        log("adyen details", resultCode)

        if (SUCCESS_RESULT_CODES.includes(resultCode)) {
          actions.resolve({ resultCode })
          await completeOrder()
          return
        }

        actions.reject()
        failWith(refusalReason)
      } catch (e) {
        console.error("Adyen express prototype: additional details failed", e)
        actions.reject()
        failWith()
      }
    }

    const applePayUpdate = (
      order: Order,
      methods?: ExpressShippingMethod[],
    ) => {
      const { label, amount, lineItems } = totals(order)

      return {
        newTotal: { label, amount, type: "final" as const },
        newLineItems: lineItems.map((item) => ({
          ...item,
          type: "final" as const,
        })),
        ...(methods != null ? { newShippingMethods: methods } : {}),
      }
    }

    type ApplePayContactField = "postalAddress" | "name" | "email" | "phone"

    const shippingContactFields: ApplePayContactField[] = isShipmentRequired
      ? ["postalAddress", "name", "email", "phone"]
      : ["name", "email", "phone"]
    const billingContactFields: ApplePayContactField[] = [
      "postalAddress",
      "name",
    ]

    const applePayConfig = (order: Order) => ({
      isExpress: true,
      buttonType: "check-out" as const,
      buttonColor: "black" as const,
      requiredBillingContactFields: billingContactFields,
      requiredShippingContactFields: shippingContactFields,
      lineItems: totals(order).lineItems.map((item) => ({
        ...item,
        type: "final" as const,
      })),
      onShippingContactSelected: async (
        resolve: (update: any) => void,
        reject: (error?: any) => void,
        event: any,
      ) => {
        try {
          const { order: updated, methods } = await applyShippingContact(
            contactFromApplePay(event?.shippingContact),
          )

          if (isShipmentRequired && methods.length === 0) {
            reject({
              code: "shippingContactInvalid",
              contactField: "postalAddress",
              message: COPY.noShippingMethods,
            })
            return
          }
          resolve(applePayUpdate(updated, methods))
        } catch (e) {
          console.error("Adyen express prototype: shipping contact failed", e)
          reject()
        }
      },
      onShippingMethodSelected: async (
        resolve: (update: any) => void,
        reject: (error?: any) => void,
        event: any,
      ) => {
        try {
          const updated = await selectShippingMethod(
            event?.shippingMethod?.identifier,
          )
          resolve(applePayUpdate(updated))
        } catch (e) {
          console.error("Adyen express prototype: shipping method failed", e)
          reject()
        }
      },
      onAuthorized: async (
        data: any,
        actions: { resolve: () => void; reject: (error?: any) => void },
      ) => {
        try {
          const payment = data?.authorizedEvent?.payment
          const shippingContact = payment?.shippingContact
          const billingContact = payment?.billingContact
          log("apple pay authorized")

          await applyAuthorizedContacts({
            email:
              shippingContact?.emailAddress ?? billingContact?.emailAddress,
            shipping: contactFromApplePay(shippingContact),
            billing: billingContact
              ? contactFromApplePay(billingContact)
              : undefined,
          })
          actions.resolve()
        } catch (e) {
          console.error("Adyen express prototype: authorization failed", e)
          actions.reject()
          failWith()
        }
      },
    })

    const googlePayTransactionInfo = (order: Order) => {
      const { label, amount, currencyCode, countryCode, lineItems } =
        totals(order)

      return {
        countryCode,
        currencyCode,
        totalPrice: amount,
        totalPriceLabel: label,
        totalPriceStatus: "FINAL" as const,
        displayItems: lineItems.map(({ label: itemLabel, amount: price }) => ({
          label: itemLabel,
          price,
          type: "LINE_ITEM" as const,
        })),
      }
    }

    const googlePayConfig = (order: Order) => ({
      isExpress: true,
      expressPage: "checkout" as const,
      buttonType: "checkout" as const,
      buttonSizeMode: "fill" as const,
      emailRequired: true,
      billingAddressRequired: true,
      billingAddressParameters: {
        format: "FULL" as const,
        phoneNumberRequired: true,
      },
      shippingAddressRequired: isShipmentRequired,
      shippingOptionRequired: isShipmentRequired,
      shippingAddressParameters: { phoneNumberRequired: true },
      callbackIntents: isShipmentRequired
        ? ["SHIPPING_ADDRESS" as const, "SHIPPING_OPTION" as const]
        : [],
      transactionInfo: googlePayTransactionInfo(order),
      paymentDataCallbacks: {
        onPaymentDataChanged: async (intermediate: any) => {
          try {
            if (intermediate?.callbackTrigger === "SHIPPING_OPTION") {
              const updated = await selectShippingMethod(
                intermediate?.shippingOptionData?.id,
              )
              return { newTransactionInfo: googlePayTransactionInfo(updated) }
            }

            const { order: updated, methods } = await applyShippingContact(
              contactFromGooglePay(intermediate?.shippingAddress),
            )

            if (methods.length === 0) {
              return {
                error: {
                  reason: "SHIPPING_ADDRESS_UNSERVICEABLE" as const,
                  message: COPY.noShippingMethods,
                  intent: "SHIPPING_ADDRESS" as const,
                },
              }
            }

            return {
              newTransactionInfo: googlePayTransactionInfo(updated),
              newShippingOptionParameters: {
                defaultSelectedOptionId: methods[0].identifier,
                shippingOptions: methods.map((method) => ({
                  id: method.identifier,
                  label: method.label,
                  description: method.detail,
                })),
              },
            }
          } catch (e) {
            console.error("Adyen express prototype: payment data change", e)
            return {
              error: {
                reason: "OTHER_ERROR" as const,
                message: COPY.error,
                intent: "SHIPPING_ADDRESS" as const,
              },
            }
          }
        },
      },
      onAuthorized: async (
        data: any,
        actions: { resolve: () => void; reject: (error?: any) => void },
      ) => {
        try {
          const event = data?.authorizedEvent
          const shipping = event?.shippingAddress
          const billing = event?.paymentMethodData?.info?.billingAddress
          log("google pay authorized")

          await applyAuthorizedContacts({
            email: event?.email,
            shipping: contactFromGooglePay(shipping, { email: event?.email }),
            billing: billing
              ? contactFromGooglePay(billing, { email: event?.email })
              : undefined,
          })
          actions.resolve()
        } catch (e) {
          console.error("Adyen express prototype: authorization failed", e)
          actions.reject()
          failWith()
        }
      },
    })

    const mountWallet = async (
      createElement: () => UIElement,
      container: NullableType<HTMLDivElement>,
      name: string,
    ) => {
      if (container == null) {
        return
      }
      try {
        const element = createElement()
        await element.isAvailable()
        element.mount(container)
        elementsRef.current.push(element)
        setWallets((current) => [...current, name])
        log("wallet available", name)
      } catch {
        // Not enabled on the account, or not usable on this device/browser.
        log("wallet unavailable", name)
      }
    }

    const unavailable = (reason: string) => {
      log("unavailable", reason)
      setStatus("unavailable")
    }

    const initialize = async () => {
      setStatus("initializing")
      log("starting", `order ${orderId}`)

      const order = syncOrder(await fetchExpressOrder(cl, orderId))
      log("order loaded", `${order.status} · ${order.id}`)

      if (order.status !== "draft" && order.status !== "pending") {
        unavailable(`order is ${order.status}`)
        return
      }

      const paymentSource = order.payment_source as NullableType<AdyenPayment>
      // An Adyen source is created as soon as Adyen is selected, with an empty
      // `payment_response`: it only becomes off-limits once it carries a
      // `resultCode`, meaning a payment has actually been attempted on it.
      const isReusable =
        paymentSource?.type === "adyen_payments" &&
        paymentSource?.payment_response?.resultCode == null

      if (paymentSource != null && !isReusable) {
        // A payment has already been attempted on this order: leave it alone.
        unavailable(
          `${paymentSource.type} already paid: ${paymentSource.payment_response?.resultCode}`,
        )
        return
      }

      const paymentMethod = findAdyenPaymentMethod(order)

      if (paymentMethod == null) {
        unavailable("no Adyen payment method available on this order")
        return
      }

      paymentSourceRef.current = isReusable
        ? (paymentSource as AdyenPayment)
        : await createAdyenPaymentSource(cl, { order, paymentMethod })
      log(
        isReusable ? "payment source reused" : "payment source created",
        paymentSourceRef.current?.id,
      )

      const clientKey = paymentSourceRef.current?.public_key

      if (clientKey == null) {
        unavailable("payment source has no public_key")
        return
      }

      const checkout: ICore = await AdyenCheckout({
        environment: adyenEnvironment(accessToken),
        clientKey,
        locale: order.language_code ?? "en-US",
        countryCode: expressCountryCode(order),
        amount: expressAmount(order),
        paymentMethodsResponse: paymentSourceRef.current
          ?.payment_methods as any,
        analytics: { enabled: false },
        onSubmit,
        onAdditionalDetails,
        onError: (e) => {
          console.error("Adyen express prototype:", e)
        },
      })

      await Promise.all([
        mountWallet(
          () => new ApplePay(checkout, applePayConfig(order)),
          applePayRef.current,
          "Apple Pay",
        ),
        mountWallet(
          () => new GooglePay(checkout, googlePayConfig(order)),
          googlePayRef.current,
          "Google Pay",
        ),
      ])

      setStatus("ready")
    }

    initialize().catch((e) => {
      console.error("Adyen express prototype: initialization failed", e)
      unavailable(e?.errors?.[0]?.detail ?? e?.message ?? "see the console")
    })

    return () => {
      for (const element of elementsRef.current) {
        element.unmount()
      }
      elementsRef.current = []
    }
  }, [canStart, orderId, accessToken])

  return { status, error, wallets, events, applePayRef, googlePayRef }
}
