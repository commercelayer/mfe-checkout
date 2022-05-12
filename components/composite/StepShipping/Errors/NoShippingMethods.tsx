import { ErrorComponentProps, Errors } from "@commercelayer/react-components"
import { Dispatch, SetStateAction, useEffect } from "react"

interface Props {
  messages: ErrorComponentProps["messages"]
  setShippingMethodError: Dispatch<SetStateAction<boolean>>
  cartUrl?: string
}

export const NoShippingMethods = ({
  messages,
  setShippingMethodError,
}: Props) => {
  return (
    <Errors resource="shipments" messages={messages}>
      {({ errors }) => {
        useEffect(() => {
          setShippingMethodError(errors.length > 0 && errors[0] !== undefined)
        }, [errors.length])
        return errors.map((error, index) => <p key={index}>{error}</p>)
      }}
    </Errors>
  )
}
