import {
  BillingAddressContainer,
  Address,
  AddressField,
} from "@commercelayer/react-components"
import { Fragment, useContext, useState } from "react"
import styled from "styled-components"
import tw from "twin.macro"

import { AppContext } from "components/data/AppProvider"
import { useTranslation } from "components/data/i18n"
import { CardAddress } from "components/ui/CardAddress"
import { StepContent } from "components/ui/StepContent"
import { StepHeader } from "components/ui/StepHeader"

import { FormAddresses } from "./FormAddresses"

interface Props {
  className?: string
  isActive?: boolean
  onToggleActive: () => void
}

export const StepCustomer: React.FC<Props> = ({
  className,
  isActive,
  onToggleActive,
}) => {
  const appCtx = useContext(AppContext)
  const { t } = useTranslation()

  if (!appCtx) {
    return null
  }
  const {
    hasShippingAddress,
    hasBillingAddress,
    isGuest,
    billingAddress,
    shippingAddress,
    emailAddress,
    refetchOrder,
  } = appCtx

  // MOCKED STATE
  const hasSavedAddresses = true
  const hasAddressInOrder = hasShippingAddress && hasBillingAddress // ma non in rubrica

  // Component state
  const [showForm, setShowForm] = useState(!hasSavedAddresses)

  // todo: logica interna da implementare
  // se guest e' true: mostrare input email + form indirizzi
  // altrimenti mostrare elenco indirizzi della rubrica + pulsante aggiungi nuovo indirizzo
  // se non ci sono indirizzi in rubrica, ma solo l'indirizzo dell'ordine (non ancora salvato in rubrica) si mostra il form con i valori in edit
  console.log(billingAddress, "dsa")
  return (
    <div className={className}>
      <StepHeader
        stepNumber={1}
        status={isActive ? "edit" : "done"}
        label={t("stepCustomer.customer")}
        info={isActive ? t("stepCustomer.bill") : ""}
        onEditRequest={() => {
          onToggleActive()
        }}
      />
      <StepContent>
        {isActive ? (
          <div>
            <div>
              {showForm ? (
                <Fragment>
                  <FormAddresses
                    isGuest={isGuest}
                    refetchOrder={refetchOrder}
                    billingAddress={billingAddress}
                    shippingAddress={shippingAddress}
                    emailAddress={emailAddress}
                  />
                  {!isGuest && hasSavedAddresses ? (
                    <SampleButton onClick={() => setShowForm(false)}>
                      Torna a lista indirizzi
                    </SampleButton>
                  ) : null}
                </Fragment>
              ) : (
                <>
                  {hasSavedAddresses ? (
                    <section tw="mb-4">
                      Lista degli indirizzi, se disponibile
                      <BillingAddressContainer>
                        <Address
                          className="w-1/2 p-2 m-2 border rounded cursor-pointer hover:border-blue-500 shadow-sm"
                          selectedClassName="border-blue-500"
                          onSelect={refetchOrder}
                          data-cy="customer-billing-address"
                        >
                          <div className="flex font-bold">
                            <AddressField name="first_name" />
                            <AddressField name="last_name" className="ml-1" />
                          </div>
                          <div>
                            <AddressField name="full_address" />
                          </div>
                        </Address>
                      </BillingAddressContainer>
                    </section>
                  ) : null}

                  {hasAddressInOrder && !isGuest ? (
                    <div>
                      Indirizzo ordine (non ancora salvato)
                      <CardAddress tw="border border-blue-500">
                        <Address addresses={[billingAddress as any]}>
                          <div tw="flex flex-row">
                            <p>Fatturazione: </p>{" "}
                            <AddressField name="full_address" />
                          </div>
                        </Address>
                        <Address addresses={[shippingAddress as any]}>
                          <div tw="flex flex-row">
                            <p>Spedizione: </p>{" "}
                            <AddressField name="full_address" />
                          </div>
                        </Address>
                        <SampleButton onClick={() => setShowForm(true)}>
                          Modifica indirizzo
                        </SampleButton>
                      </CardAddress>
                    </div>
                  ) : (
                    setShowForm(true)
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            {hasShippingAddress && hasBillingAddress ? (
              <div>
                Hello, you have both shipping and billing address set:
                <Address addresses={[billingAddress as any]}>
                  <div tw="flex flex-row">
                    <p>Fatturazione: </p> <AddressField name="full_address" />
                  </div>
                </Address>
                <Address addresses={[shippingAddress as any]}>
                  <div tw="flex flex-row">
                    <p>Spedizione: </p> <AddressField name="full_address" />
                  </div>
                </Address>
              </div>
            ) : hasShippingAddress ? (
              <div>Hello, you have only shipping address set</div>
            ) : hasBillingAddress ? (
              <div>Hello, you have only billing address set</div>
            ) : (
              <div>No Billing / Shipping Address set</div>
            )}
          </div>
        )}
      </StepContent>
    </div>
  )
}

const SampleButton = styled.button`
  ${tw`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent shadow-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
`
