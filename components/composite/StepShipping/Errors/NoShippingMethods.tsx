import { Errors } from "@commercelayer/react-components"

export const NoShippingMethods = ({ messages, setShippingMethodError }) => {
  return (
    <Errors
      resource="shipments"
      messages={messages}
      setError={setShippingMethodError}
    >
      {({ errors, setError }) => {
        setError(errors.length > 0 && errors[0] !== undefined)

        return errors.map((error, index) => <p key={index}>{error}</p>)
      }}
    </Errors>
  )
}
