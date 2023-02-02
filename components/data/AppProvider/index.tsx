import CommerceLayer, {
  type ShippingMethod as ShippingMethodCollection,
  type PaymentMethod,
  type Order,
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
  getOrderFromRef: () => Promise<Order>
  setCustomerEmail: (email: string) => void
  setAddresses: (order?: Order) => Promise<void>
  setCouponOrGiftCard: () => Promise<void>
  saveShipments: () => void
  placeOrder: (order?: Order) => Promise<void>
  setPayment: (params: { payment?: PaymentMethod; order?: Order }) => void
  selectShipment: (params: {
    shippingMethod: {
      id: string
    }
    shipmentId: string
    order?: Order
  }) => Promise<void>
  autoSelectShippingMethod: (order?: Order) => Promise<void>
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
  children?: JSX.Element[] | JSX.Element | null
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
    const order = await getOrderFromRef()
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

  const setAddresses = async (order?: Order) => {
    dispatch({ type: ActionType.START_LOADING })
    const currentOrder = order ?? (await getOrderFromRef())
    const isShipmentRequired = await checkIfShipmentRequired(cl, orderId)

    const others = calculateSettings(
      currentOrder,
      isShipmentRequired,
      // FIX We are using customer addresses saved in reducer because
      // we don't receive them from fetchOrder
      state.customerAddresses
    )

    dispatch({
      type: ActionType.SET_ADDRESSES,
      payload: {
        order: currentOrder,
        others,
      },
    })
  }

  const setCouponOrGiftCard = async (order?: Order) => {
    const currentOrder = order ?? (await getOrderFromRef())
    if (state.order) {
      dispatch({ type: ActionType.START_LOADING })

      const others = calculateSettings(
        currentOrder,
        state.isShipmentRequired,
        state.customerAddresses
      )

      dispatch({
        type: ActionType.CHANGE_COUPON_OR_GIFTCARD,
        payload: { order: currentOrder, others },
      })
    }
  }

  const selectShipment = async (params: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shippingMethod: ShippingMethodCollection | Record<string, any>
    shipmentId: string
    order?: Order
  }) => {
    // dispatch({ type: ActionType.START_LOADING })
    // TODO Remove after fixing components
    const currentOrder = params.order ?? (await fetchOrder(cl, orderId))

    const others = calculateSettings(
      currentOrder,
      state.isShipmentRequired,
      state.customerAddresses
    )

    dispatch({
      type: ActionType.SELECT_SHIPMENT,
      payload: {
        order: currentOrder,
        others,
        shipment: {
          shippingMethod: params.shippingMethod,
          shipmentId: params.shipmentId,
        },
      },
    })
  }

  const autoSelectShippingMethod = async (_order?: Order) => {
    dispatch({ type: ActionType.START_LOADING })
    const currentOrder = await fetchOrder(cl, orderId)
    const others = calculateSettings(
      currentOrder,
      state.isShipmentRequired,
      state.customerAddresses
    )
    dispatch({
      type: ActionType.SAVE_SHIPMENTS,
      payload: {
        order: currentOrder,
        others,
      },
    })
  }

  const saveShipments = async () => {
    dispatch({ type: ActionType.START_LOADING })
    const currentOrder = await getOrderFromRef()
    const others = calculateSettings(
      currentOrder,
      state.isShipmentRequired,
      state.customerAddresses
    )

    setTimeout(() => {
      dispatch({
        type: ActionType.SAVE_SHIPMENTS,
        payload: { order: currentOrder, others },
      })
    }, 100)
  }

  const setPayment = async (params: {
    payment?: PaymentMethod
    order?: Order
  }) => {
    dispatch({ type: ActionType.START_LOADING })
    const currentOrder = params.order ?? (await getOrderFromRef())

    const others = calculateSettings(
      currentOrder,
      state.isShipmentRequired,
      state.customerAddresses
    )

    dispatch({
      type: ActionType.SET_PAYMENT,
      payload: { payment: params.order, order: currentOrder, others },
    })
  }

  const placeOrder = async (order?: Order) => {
    dispatch({ type: ActionType.START_LOADING })
    const currentOrder = order ?? (await getOrderFromRef())

    dispatch({
      type: ActionType.PLACE_ORDER,
      payload: { order: currentOrder },
    })
  }

  const getOrderFromRef = async () => {
    return orderRef.current || (await fetchOrder(cl, orderId))
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
        getOrderFromRef,
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
