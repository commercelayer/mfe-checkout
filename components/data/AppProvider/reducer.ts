import { prepareShipments } from "./fetchOrderById"

import { AppStateData } from "."

export enum ActionType {
  START_LOADING = "START_LOADING",
  STOP_LOADING = "STOP_LOADING",
  SET_ORDER = "SET_ORDER",
  SELECT_SHIPMENT = "SELECT_SHIPMENT",
  SET_ADDRESSES = "SET_ADDRESSES",
  SAVE_SHIPMENTS = "SAVE_SHIPMENTS",
}

export type Action =
  | {
      type: ActionType.SET_ORDER
      payload: {
        order: any
        others: Partial<AppStateData>
      }
    }
  | {
      type: ActionType.SELECT_SHIPMENT
      payload: {
        shipmentId: string
        shippingMethod: {
          id: string
        }
      }
    }
  | { type: ActionType.START_LOADING }
  | { type: ActionType.STOP_LOADING }
  | {
      type: ActionType.SAVE_SHIPMENTS
      payload: {
        shipments: any
      }
    }
  | {
      type: ActionType.SET_ADDRESSES
      payload: {
        billingAddress: any
        shippingAddress: any
        shipments: any
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
    case ActionType.SET_ADDRESSES:
      console.log(state.order.shipments)
      return {
        ...state,
        ...action.payload,
        hasBillingAddress: Boolean(action.payload.billingAddress),
        hasShippingAddress: Boolean(action.payload.shippingAddress),
        hasShippingMethod: !state.isShipmentRequired,
        shipments: state.isShipmentRequired
          ? prepareShipments(action.payload.shipments)
          : [],
        isLoading: false,
      }
    case ActionType.SELECT_SHIPMENT: {
      const shipmentsSelected = calculateSelectedShipments(
        state.shipments,
        action.payload
      )
      const shippingMethods = shipmentsSelected?.map(
        (a: ShipmentSelected) => a.shippingMethodId
      )

      return {
        ...state,
        shipments: shipmentsSelected,
        hasShippingMethod: Boolean(
          shippingMethods?.length && !shippingMethods?.includes(undefined)
        ),
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

    default:
      throw new Error(`Unknown action type`)
  }
}

function calculateSelectedShipments(shipments, payload) {
  return shipments?.map((shipment) => {
    return shipment.shipmentId === payload.shipmentId
      ? {
          ...shipment,
          shippingMethodId: payload.shippingMethod.id,
          shippingMethodName: payload.shippingMethod.name,
        }
      : shipment
  })
}
