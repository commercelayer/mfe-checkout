import {
  Order,
  Shipment,
  PaymentMethod,
  ShippingMethod,
} from "@commercelayer/sdk"

import { AppStateData } from "components/data/AppProvider"
import {
  prepareShipments,
  checkPaymentMethod,
  calculateAddresses,
  calculateSelectedShipments,
  creditCardPayment,
} from "components/data/AppProvider/utils"

export enum ActionType {
  START_LOADING = "START_LOADING",
  STOP_LOADING = "STOP_LOADING",
  SET_ORDER = "SET_ORDER",
  SET_CUSTOMER_EMAIL = "SET_CUSTOMER_EMAIL",
  SET_ADDRESSES = "SET_ADDRESSES",
  SELECT_SHIPMENT = "SELECT_SHIPMENT",
  SAVE_SHIPMENTS = "SAVE_SHIPMENTS",
  SET_PAYMENT = "SET_PAYMENT",
  PLACE_ORDER = "PLACE_ORDER",
}

export type Action =
  | { type: ActionType.START_LOADING }
  | { type: ActionType.STOP_LOADING }
  | {
      type: ActionType.SET_ORDER
      payload: {
        order: Order
        others: Partial<AppStateData>
      }
    }
  | {
      type: ActionType.SET_CUSTOMER_EMAIL
      payload: {
        customerEmail?: string
      }
    }
  | {
      type: ActionType.SET_ADDRESSES
      payload: {
        order: Order
      }
    }
  | {
      type: ActionType.SELECT_SHIPMENT
      payload: {
        shipmentId: string
        shippingMethod: ShippingMethod | Record<string, any>
      }
    }
  | {
      type: ActionType.SAVE_SHIPMENTS
      payload: {
        shipments?: Array<Shipment>
      }
    }
  | {
      type: ActionType.SET_PAYMENT
      payload: {
        payment?: PaymentMethod
      }
    }
  | {
      type: ActionType.PLACE_ORDER
      payload: {
        order: Order
      }
    }

export function reducer(state: AppStateData, action: Action): AppStateData {
  switch (action.type) {
    case ActionType.START_LOADING:
      return {
        ...state,
        isLoading: true,
      }
    case ActionType.STOP_LOADING:
      return {
        ...state,
        isLoading: false,
      }
    case ActionType.SET_ORDER:
      return {
        ...state,
        order: action.payload.order,
        ...action.payload.others,
        isFirstLoading: false,
        isLoading: false,
      }
    case ActionType.SET_CUSTOMER_EMAIL:
      return {
        ...state,
        emailAddress: action.payload.customerEmail,
        hasEmailAddress: Boolean(action.payload.customerEmail),
        isLoading: false,
      }
    case ActionType.SET_ADDRESSES:
      return {
        ...state,
        ...calculateAddresses(action.payload.order, state.customerAddresses),
        shipments: state.isShipmentRequired
          ? prepareShipments(action.payload.order.shipments)
          : [],
        isLoading: false,
      }
    case ActionType.SELECT_SHIPMENT: {
      return {
        ...state,
        ...calculateSelectedShipments(state.shipments, action.payload),
        isLoading: false,
      }
    }
    case ActionType.SAVE_SHIPMENTS:
      return {
        ...state,
        isLoading: false,
        shipments: state.isShipmentRequired
          ? prepareShipments(action.payload.shipments)
          : [],
      }
    case ActionType.SET_PAYMENT:
      return {
        ...state,
        isLoading: false,
        isCreditCard: creditCardPayment(action.payload.payment),
        paymentMethod: action.payload.payment,
      }
    case ActionType.PLACE_ORDER: {
      return {
        ...state,
        ...checkPaymentMethod(action.payload.order),
        isLoading: false,
      }
    }
    default:
      throw new Error(`Unknown action type`)
  }
}