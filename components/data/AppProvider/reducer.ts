import {
  Order,
  Shipment,
  PaymentMethod,
  ShippingMethod,
} from "@commercelayer/sdk"

import {
  prepareShipments,
  checkPaymentMethod,
  calculateAddresses,
  calculateSelectedShipments,
} from "./fetchOrderById"

import { AppStateData } from "."

export enum ActionType {
  START_LOADING = "START_LOADING",
  STOP_LOADING = "STOP_LOADING",
  SET_ORDER = "SET_ORDER",
  SET_CUSTOMER_EMAIL = "SET_CUSTOMER_EMAIL",
  SELECT_SHIPMENT = "SELECT_SHIPMENT",
  SET_ADDRESSES = "SET_ADDRESSES",
  SAVE_SHIPMENTS = "SAVE_SHIPMENTS",
  SET_PAYMENT = "SET_PAYMENT",
  PLACE_ORDER = "PLACE_ORDER",
}

export type Action =
  | {
      type: ActionType.SET_ORDER
      payload: {
        order: Order
        others: Partial<AppStateData>
      }
    }
  | {
      type: ActionType.SELECT_SHIPMENT
      payload: {
        shipmentId: string
        shippingMethod: ShippingMethod | Record<string, any>
      }
    }
  | { type: ActionType.START_LOADING }
  | { type: ActionType.STOP_LOADING }
  | {
      type: ActionType.PLACE_ORDER
      payload: {
        order: Order
      }
    }
  | {
      type: ActionType.SET_CUSTOMER_EMAIL
      payload: {
        customerEmail?: string
      }
    }
  | {
      type: ActionType.SAVE_SHIPMENTS
      payload: {
        shipments?: Array<Shipment>
      }
    }
  | {
      type: ActionType.SET_ADDRESSES
      payload: {
        order: Order
      }
    }
  | {
      type: ActionType.SET_PAYMENT
      payload: {
        payment?: PaymentMethod
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
        hasShippingMethod: !action.payload.others.isShipmentRequired,
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
    case ActionType.PLACE_ORDER: {
      return {
        ...state,
        ...checkPaymentMethod(action.payload.order),
        isLoading: false,
      }
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
        paymentMethod: action.payload.payment,
      }

    default:
      throw new Error(`Unknown action type`)
  }
}
