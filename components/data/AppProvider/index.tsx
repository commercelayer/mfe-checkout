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
  autoSelectShippingMethod: () => void
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
    if (!orderId || !accessToken) {
      return
    }
    dispatch({ type: ActionType.START_LOADING })
    const order = orderRef.current || (await fetchOrder(cl, orderId))
    const isShipmentRequired = await checkIfShipmentRequired(cl, orderId)

    const addressInfos = await checkAndSetDefaultAddressForOrder({
      cl,
      order,
    })

    const others = calculateSettings(order, isShipmentRequired)

    dispatch({
      type: ActionType.SET_ORDER,
      payload: {
        order,
        others: {
          isShipmentRequired,
          ...others,
          ...addressInfos,
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

    const others = calculateSettings(
      order,
      isShipmentRequired,
      // FIX We are using customer addresses saved in reducer because
      // we don't receive them from fetchOrder
      state.customerAddresses
    )

    dispatch({
      type: ActionType.SET_ADDRESSES,
      payload: {
        order,
        others,
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

  const autoSelectShippingMethod = async () => {
    dispatch({ type: ActionType.START_LOADING })

    const order = await fetchOrder(cl, orderId)
    const others = calculateSettings(order, state.isShipmentRequired)

    dispatch({
      type: ActionType.SAVE_SHIPMENTS,
      payload: {
        order,
        others,
      },
    })
  }

  const saveShipments = async () => {
    dispatch({ type: ActionType.START_LOADING })
    const order = orderRef.current || (await fetchOrder(cl, orderId))

    const others = calculateSettings(order, state.isShipmentRequired)

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
        autoSelectShippingMethod,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
