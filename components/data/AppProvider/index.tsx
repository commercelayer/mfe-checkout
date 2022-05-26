import CommerceLayer, {
  ShippingMethod as ShippingMethodCollection,
  PaymentMethod,
  Order,
} from "@commercelayer/sdk"
import { changeLanguage } from "i18next"
import { createContext, useEffect, useReducer, useRef } from "react"

import { ActionType, reducer } from "components/data/AppProvider/reducer"
import {
  calculateSettings,
  checkAndSetDefaultAddressForOrder,
  checkIfShipmentRequired,
  fetchOrder,
  FetchOrderByIdResponse,
  setAutomatedShippingMethods,
  isPaymentRequired,
} from "components/data/AppProvider/utils"

export interface AppProviderData extends FetchOrderByIdResponse {
  isLoading: boolean
  orderId: string
  accessToken: string
  slug: string
  domain: string
  isFirstLoading: boolean
  getOrder: (order: Order) => void
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
  ) => Promise<void>
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
  cartUrl: undefined,
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
  const orderRef = useRef<Order>()
  const [state, dispatch] = useReducer(reducer, initialState)

  const cl = CommerceLayer({
    organization: slug,
    accessToken: accessToken,
    domain,
  })

  const getOrder = (order: Order) => {
    orderRef.current = order
  }

  const fetchInitialOrder = async (orderId?: string, accessToken?: string) => {
    console.log("fetch initialState", orderRef.current)
    if (!orderId || !accessToken) {
      return
    }
    dispatch({ type: ActionType.START_LOADING })
    let order = orderRef.current || (await fetchOrder(cl, orderId))
    const isShipmentRequired = await checkIfShipmentRequired(cl, orderId)

    const addressInfos = await checkAndSetDefaultAddressForOrder({
      cl,
      order,
    })

    // const shippingInfos = await setAutomatedShippingMethods(
    //   cl,
    //   order,
    //   !!(Object.keys(addressInfos).length > 0
    //     ? addressInfos.hasBillingAddress && addressInfos.hasShippingAddress
    //     : Boolean(order.shipping_address) && Boolean(order.billing_address))
    // )

    const shippingInfos = {}

    const paymentRequired = isPaymentRequired(order)

    // if (
    //   isShipmentRequired &&
    //   shippingInfos.hasShippingMethod &&
    //   !paymentRequired
    // ) {
    //   order = await fetchOrder(cl, orderId)
    // }

    const others = calculateSettings(order, isShipmentRequired)

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

    const order = orderRef.current || (await fetchOrder(cl, orderId))

    const isShipmentRequired = await checkIfShipmentRequired(cl, orderId)

    // const shippingInfos = await setAutomatedShippingMethods(
    //   cl,
    //   order,
    //   !!(Boolean(order.billing_address) && Boolean(order.shipping_address))
    // )

    const shippingInfos = {}

    const paymentRequired = isPaymentRequired(order)

    // if (
    //   isShipmentRequired &&
    //   shippingInfos.hasShippingMethod &&
    //   !paymentRequired
    // ) {
    //   order = await fetchOrder(cl, orderId)
    // }

    const others = calculateSettings(order, isShipmentRequired)

    dispatch({
      type: ActionType.SET_ADDRESSES,
      payload: {
        order,
        others,
        automatedShippingMethod: { ...shippingInfos },
      },
    })
  }

  const setCouponOrGiftCard = async () => {
    const order = orderRef.current || (await fetchOrder(cl, orderId))
    if (state.order) {
      dispatch({ type: ActionType.START_LOADING })

      const others = calculateSettings(order, state.isShipmentRequired)

      dispatch({
        type: ActionType.CHANGE_COUPON_OR_GIFTCARD,
        payload: { order, others },
      })
    }
  }

  const selectShipment = async (
    shippingMethod: ShippingMethodCollection | Record<string, any>,
    shipmentId: string
  ) => {
    // dispatch({ type: ActionType.START_LOADING })
    // TODO Remove after fixing components
    const order = await fetchOrder(cl, orderId)

    const others = calculateSettings(order, state.isShipmentRequired)

    dispatch({
      type: ActionType.SELECT_SHIPMENT,
      payload: {
        order,
        others,
        shipment: {
          shippingMethod,
          shipmentId,
        },
      },
    })
  }

  const saveShipments = async () => {
    dispatch({ type: ActionType.START_LOADING })
    const order = orderRef.current || (await fetchOrder(cl, orderId))

    const others = calculateSettings(order, state.isShipmentRequired)

    console.log("others in save", others)
    setTimeout(() => {
      dispatch({
        type: ActionType.SAVE_SHIPMENTS,
        payload: { order, others },
      })
    }, 100)
  }

  const setPayment = async (payment?: PaymentMethod) => {
    dispatch({ type: ActionType.START_LOADING })
    const order = orderRef.current || (await fetchOrder(cl, orderId))

    const others = calculateSettings(order, state.isShipmentRequired)

    dispatch({
      type: ActionType.SET_PAYMENT,
      payload: { payment, order, others },
    })
  }

  const placeOrder = async () => {
    dispatch({ type: ActionType.START_LOADING })
    const order = orderRef.current || (await fetchOrder(cl, orderId))

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
        getOrder,
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
