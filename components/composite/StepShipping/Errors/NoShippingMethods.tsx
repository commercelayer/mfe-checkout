import { Errors } from "@commercelayer/react-components/errors/Errors"
import { type Dispatch, type SetStateAction, useEffect } from "react"

interface Props {
  messages: Parameters<typeof Errors>[0]["messages"]
  setShippingMethodError: Dispatch<SetStateAction<boolean>>
  cartUrl?: NullableType<string>
}

export const NoShippingMethods = ({
  messages,
  setShippingMethodError,
}: Props) => {
  return (
    <Errors resource="shipments" messages={messages}>
      {({ errors }) => {
        return (
          <>
            <ErrorEffect
              errors={errors}
              setShippingMethodError={setShippingMethodError}
            />
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </>
        )
      }}
    </Errors>
  )
}

const ErrorEffect = ({
  errors,
  setShippingMethodError,
}: {
  errors: any[]
  setShippingMethodError: Dispatch<SetStateAction<boolean>>
}) => {
  useEffect(() => {
    setShippingMethodError(errors.length > 0 && errors[0] !== undefined)
  }, [errors.length, setShippingMethodError])

  return null
}
