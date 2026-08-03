import type {
  Order,
  PaymentMethod,
  ShippingMethod as ShippingMethodCollection,
} from "@commercelayer/sdk"
import { CommerceLayer } from "@commercelayer/sdk/bundle"
import { ActionType, reducer } from "components/data/AppProvider/reducer"
import {
  calculateSettings,
  checkAndSetDefaultAddressForOrder,
  type FetchOrderByIdResponse,
  fetchOrder,
} from "components/data/AppProvider/utils"
import { changeLanguage } from "i18next"
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"

export interface AppProviderData extends FetchOrderByIdResponse {
  isLoading: boolean
  orderId: string
  order: NullableType<Order>
  accessToken: string
  isGuest: boolean
  slug: string
  domain: string
  isFirstLoading: boolean
  getOrder: (order: Order) => void
  getOrderFromRef: () => Promise<Order>
  setCustomerEmail: (email: string) => void
  setAddresses: (order?: Order) => Promise<void>
  setCouponOrGiftCard: () => Promise<void>
  saveShipments: () => Promise<Order>
  placeOrder: (order?: Order) => Promise<void>
  setPayment: (params: { payment?: PaymentMethod; order?: Order }) => void
  selectShipment: (params: {
    shippingMethod: {
      id: string
    }
    shipmentId: string
    order?: Order
  }) => Promise<void>
  autoSelectShippingMethod: (order?: Order) => Promise<Order>
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
  hasSubscriptions: false,
}

export const AppContext = createContext<AppProviderData | null>(null)

interface AppProviderProps {
  domain: string
  slug: string
  orderId: string
  isGuest: boolean
  isShipmentRequired: boolean
  accessToken: string
  children?: ChildrenType
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  orderId,
  isGuest,
  isShipmentRequired,
  accessToken,
  slug,
  domain,
}) => {
  const orderRef = useRef<Order | undefined>(undefined)
  const [state, dispatch] = useReducer(reducer, { ...initialState, isGuest })
  const [order, setOrder] = useState<NullableType<Order>>()

  // The React-19 library keys effects on the callback props we pass it (e.g.
  // <OrderContainer fetchOrder>, <PaymentMethod onClick/autoSelect...>). A
  // fresh identity each render re-fires those effects every render → infinite
  // update loops. So the CommerceLayer client and every callback below are
  // memoised to a stable identity; mutable state is read through a ref so the
  // callbacks never need to close over changing values.
  const cl = useMemo(
    () => CommerceLayer({ organization: slug, accessToken, domain }),
    [slug, accessToken, domain],
  )

  const stateRef = useRef(state)
  stateRef.current = state

  // Passed as <OrderContainer fetchOrder>; closes over only stable refs.
  const getOrder = useCallback((order: Order) => {
    orderRef.current = order
    // OrderContainer (react-components) invokes this callback during render,
    // so defer the state update to avoid a render-phase setState warning.
    setTimeout(() => {
      setOrder(order)
    }, 0)
  }, [])

  const fetchInitialOrder = useCallback(
    async (orderId?: string, accessToken?: string) => {
      if (!orderId || !accessToken) {
        return
      }
      dispatch({ type: ActionType.START_LOADING })
      const order = await getOrderFromRef()

    const { shipments, ...addressInfos } =
      await checkAndSetDefaultAddressForOrder({
        cl,
        order,
      })

    const others = calculateSettings(
      shipments != null ? { ...order, shipments: shipments } : order,
      isShipmentRequired,
      isGuest,
      undefined,
    )

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

    await changeLanguage(order.language_code ?? "en")
  }, [])

  const setCustomerEmail = useCallback((email: string) => {
    dispatch({
      type: ActionType.SET_CUSTOMER_EMAIL,
      payload: { customerEmail: email },
    })
  }, [])

  const setAddresses = useCallback(async (order?: Order) => {
    dispatch({ type: ActionType.START_LOADING })
    const currentOrder = order ?? (await getOrderFromRef())

    const others = calculateSettings(
      currentOrder,
      isShipmentRequired,
      // FIX We are using customer addresses saved in reducer because
      // we don't receive them from fetchOrder
      isGuest,
      stateRef.current.customerAddresses,
    )
    setTimeout(() => {
      dispatch({
        type: ActionType.SET_ADDRESSES,
        payload: {
          order: currentOrder,
          others,
        },
      })
    }, 100)
  }, [])

  const setCouponOrGiftCard = useCallback(async (order?: Order) => {
    const currentOrder = order ?? (await getOrderFromRef())
    if (stateRef.current.order) {
      dispatch({ type: ActionType.START_LOADING })

      const others = calculateSettings(
        currentOrder,
        stateRef.current.isShipmentRequired,
        isGuest,
        stateRef.current.customerAddresses,
      )
      setTimeout(() => {
        dispatch({
          type: ActionType.CHANGE_COUPON_OR_GIFTCARD,
          payload: { order: currentOrder, others },
        })
      }, 100)
    }
  }, [])

  const selectShipment = useCallback(
    async (params: {
      shippingMethod: ShippingMethodCollection | Record<string, any>
      shipmentId: string
      order?: Order
    }) => {
      // dispatch({ type: ActionType.START_LOADING })
      // TODO Remove after fixing components
      const currentOrder = params.order ?? (await fetchOrder(cl, orderId))

      const others = calculateSettings(
        currentOrder,
        stateRef.current.isShipmentRequired,
        isGuest,
        stateRef.current.customerAddresses,
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
    },
    [],
  )

  const autoSelectShippingMethod = useCallback(async (order?: Order) => {
    dispatch({ type: ActionType.START_LOADING })
    const currentOrder = order ?? (await fetchOrder(cl, orderId))

    const others = calculateSettings(
      currentOrder,
      stateRef.current.isShipmentRequired,
      isGuest,
      stateRef.current.customerAddresses,
    )
    setTimeout(() => {
      dispatch({
        type: ActionType.SAVE_SHIPMENTS,
        payload: { order: currentOrder, others },
      })
    }, 100)

    return currentOrder
  }, [])

  const saveShipments = useCallback(async () => {
    dispatch({ type: ActionType.START_LOADING })
    const currentOrder = await getOrderFromRef()
    const others = calculateSettings(
      currentOrder,
      stateRef.current.isShipmentRequired,
      isGuest,
      stateRef.current.customerAddresses,
    )

    setTimeout(() => {
      dispatch({
        type: ActionType.SAVE_SHIPMENTS,
        payload: { order: currentOrder, others },
      })
    }, 100)

    return currentOrder
  }, [])

  const setPayment = useCallback(
    async (params: { payment?: PaymentMethod; order?: Order }) => {
      dispatch({ type: ActionType.START_LOADING })
      const currentOrder = params.order ?? (await getOrderFromRef())

      const others = calculateSettings(
        currentOrder,
        stateRef.current.isShipmentRequired,
        isGuest,
        stateRef.current.customerAddresses,
      )

      dispatch({
        type: ActionType.SET_PAYMENT,
        payload: { payment: params.payment, order: currentOrder, others },
      })
    },
    [],
  )

  const placeOrder = useCallback(async (order?: Order) => {
    dispatch({ type: ActionType.START_LOADING })
    if (order && order.customer_email != null) {
      setCustomerEmail(order.customer_email)
    }
    const currentOrder = order ?? (await getOrderFromRef())

    dispatch({
      type: ActionType.PLACE_ORDER,
      payload: { order: currentOrder },
    })
  }, [])

  const getOrderFromRef = useCallback(async () => {
    return orderRef.current || (await fetchOrder(cl, orderId))
  }, [cl, orderId])

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
        cartUrl: state.cartUrl?.replace(":slug", slug),
        orderId,
        order,
        accessToken,
        isGuest,
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
