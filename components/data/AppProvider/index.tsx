import CommerceLayer, {
  ShippingMethod as ShippingMethodCollection,
  PaymentMethod,
  Order,
} from "@commercelayer/sdk"
import { changeLanguage } from "i18next"
import { createContext, useEffect, useReducer } from "react"

import { ActionType, reducer } from "components/data/AppProvider/reducer"
import {
  calculateSettings,
  checkAndSetDefaultAddressForOrder,
  checkIfShipmentRequired,
  fetchOrder,
  FetchOrderByIdResponse,
  setAutomatedShippingMethods,
} from "components/data/AppProvider/utils"

export interface AppProviderData extends FetchOrderByIdResponse {
  isLoading: boolean
  orderId: string
  accessToken: string
  slug: string
  domain: string
  isFirstLoading: boolean
  setCustomerEmail: (email: string) => void
  setAddresses: () => void
  setCouponOrGiftCard: () => Promise<void>
  saveShipments: () => void
  placeOrder: () => Promise<void>
  setPayment: (payment?: PaymentMethod) => void
  selectShipment: (
    shippingMethod: {
      id: string
    },
    shipmentId: string
  ) => void
}

export interface AppStateData extends FetchOrderByIdResponse {
  order?: Order
  isLoading: boolean
  isFirstLoading: boolean
}

const initialState: AppStateData = {
  order: undefined,
  isLoading: true,
  isFirstLoading: true,
  isGuest: false,
  hasCustomerAddresses: false,
  isUsingNewBillingAddress: true,
  isUsingNewShippingAddress: true,
  hasSameAddresses: false,
  hasEmailAddress: false,
  emailAddress: "",
  hasBillingAddress: false,
  billingAddress: undefined,
  requiresBillingInfo: false,
  isShipmentRequired: true,
  shippingAddress: undefined,
  hasShippingMethod: false,
  hasShippingAddress: false,
  shipments: [],
  customerAddresses: [],
  paymentMethod: undefined,
  hasPaymentMethod: false,
  isPaymentRequired: true,
  isCreditCard: false,
  shippingCountryCodeLock: "",
  isComplete: false,
  returnUrl: "",
  taxIncluded: false,
  shippingMethodName: undefined,
}

export const AppContext = createContext<AppProviderData | null>(null)

interface AppProviderProps {
  domain: string
  slug: string
  orderId: string
  accessToken: string
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  orderId,
  accessToken,
  slug,
  domain,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const cl = CommerceLayer({
    organization: slug,
    accessToken: accessToken,
    domain,
  })

  const fetchInitialOrder = async (orderId?: string, accessToken?: string) => {
    if (!orderId || !accessToken) {
      return
    }
    dispatch({ type: ActionType.START_LOADING })
    const order = await fetchOrder(cl, orderId)
    const isShipmentRequired = await checkIfShipmentRequired(cl, orderId)
    const others = calculateSettings(order, isShipmentRequired)

    const addressInfos = await checkAndSetDefaultAddressForOrder({
      cl,
      order,
    })

    const shippingInfos = await setAutomatedShippingMethods(
      cl,
      order,
      !!(Object.keys(addressInfos).length > 0
        ? addressInfos.hasBillingAddress && addressInfos.hasShippingAddress
        : others.hasShippingAddress && others.hasBillingAddress)
    )

    dispatch({
      type: ActionType.SET_ORDER,
      payload: {
        order,
        others: {
          isShipmentRequired,
          ...others,
          ...addressInfos,
          ...shippingInfos,
        },
      },
    })

    await changeLanguage(order.language_code)
  }

  const setCustomerEmail = (email: string) => {
    dispatch({
      type: ActionType.SET_CUSTOMER_EMAIL,
      payload: { customerEmail: email },
    })
  }

  const setAddresses = async () => {
    dispatch({ type: ActionType.START_LOADING })

    const order = await cl.orders.retrieve(orderId, {
      fields: {
        orders: ["shipping_address", "billing_address", "shipments"],
        shipments: ["shipping_method"],
      },
      include: [
        "shipping_address",
        "billing_address",
        "shipments",
        "shipments.shipping_method",
      ],
    })

    const shippingInfos = await setAutomatedShippingMethods(
      cl,
      order,
      !!(order.billing_address && order.shipping_address)
    )

    dispatch({
      type: ActionType.SET_ADDRESSES,
      payload: {
        order,
        automatedShippingMethod: { ...shippingInfos },
      },
    })
  }

  const setCouponOrGiftCard = async () => {
    if (state.paymentMethod) {
      // dispatch({ type: ActionType.START_LOADING })
      // fetch new order data
      // dispatch({
      //   type: ActionType.CHANGE_COUPON_OR_GIFTCARD,
      // })
    }
  }

  const selectShipment = async (
    shippingMethod: ShippingMethodCollection | Record<string, any>,
    shipmentId: string
  ) => {
    dispatch({
      type: ActionType.SELECT_SHIPMENT,
      payload: {
        shippingMethod,
        shipmentId,
      },
    })
  }

  const saveShipments = async () => {
    dispatch({ type: ActionType.START_LOADING })
    const order = await cl.orders.retrieve(orderId, {
      fields: {
        orders: ["id", "shipments"],
        shipments: ["shipping_method"],
      },
      include: ["shipments", "shipments.shipping_method"],
    })

    dispatch({
      type: ActionType.SAVE_SHIPMENTS,
      payload: { shipments: order.shipments },
    })
  }

  const setPayment = (payment?: PaymentMethod) => {
    dispatch({ type: ActionType.SET_PAYMENT, payload: { payment } })
  }

  const placeOrder = async () => {
    dispatch({ type: ActionType.START_LOADING })
    const order = await cl.orders.retrieve(orderId, {
      fields: {
        orders: ["id", "status", "payment_method", "payment_source"],
      },
      include: ["payment_method", "payment_source"],
    })
    dispatch({
      type: ActionType.PLACE_ORDER,
      payload: { order },
    })
  }

  useEffect(() => {
    const unsubscribe = () => {
      fetchInitialOrder(orderId, accessToken)
    }
    return unsubscribe()
  }, [orderId, accessToken])

  return (
    <AppContext.Provider
      value={{
        ...state,
        orderId,
        accessToken,
        slug,
        domain,
        setAddresses,
        selectShipment,
        saveShipments,
        setPayment,
        setCouponOrGiftCard,
        placeOrder,
        setCustomerEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
