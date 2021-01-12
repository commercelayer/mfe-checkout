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
  // MOCKED STATE
  const hasSavedAddresses = true
  const hasAddressInOrder = true // ma non in rubrica

  // Component state
  const [showForm, setShowForm] = useState(!hasSavedAddresses)
  const appCtx = useContext(AppContext)
  const { t } = useTranslation()

  if (!appCtx) {
    return null
  }
  const { hasShippingAddress, hasBillingAddress, isGuest } = appCtx

  // todo: logica interna da implementare
  // se guest e' true: mostrare input email + form indirizzi
  // altrimenti mostrare elenco indirizzi della rubrica + pulsante aggiungi nuovo indirizzo
  // se non ci sono indirizzi in rubrica, ma solo l'indirizzo dell'ordine (non ancora salvato in rubrica) si mostra il form con i valori in edit

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
                  <FormAddresses isGuest={isGuest} />
                  {!isGuest && hasSavedAddresses ? (
                    <SampleButton onClick={() => setShowForm(false)}>
                      Torna a lista indirizzi
                    </SampleButton>
                  ) : null}
                </Fragment>
              ) : (
                <Fragment>
                  {hasSavedAddresses ? (
                    <section tw="mb-4">
                      Lista degli indirizzi, se disponibile
                      <CardAddress tw="">
                        Via Bonozzo Gozzoli, 5/4
                        <div>
                          <SampleButton>usa come spedizione</SampleButton>
                        </div>
                      </CardAddress>
                      <CardAddress tw="">
                        Via di Firenze, 40
                        <div>
                          <SampleButton tw="mr-4">
                            usa come fatturazione
                          </SampleButton>
                        </div>
                      </CardAddress>
                      <CardAddress>
                        <div>Via Milano 40</div>
                        <div>
                          <SampleButton tw="mr-4">
                            usa come fatturazione
                          </SampleButton>
                          <SampleButton>usa come spedizione</SampleButton>
                        </div>
                      </CardAddress>
                    </section>
                  ) : null}

                  {hasAddressInOrder ? (
                    <div>
                      Indirizzo ordine (non ancora salvato)
                      <CardAddress tw="border border-blue-500">
                        <div>Fatturazione: Via Bonozzo Gozzoli, 5/4</div>
                        <div>Spedizione: Via di Firenze, 40</div>
                        <SampleButton onClick={() => setShowForm(true)}>
                          Modifica indirizzo
                        </SampleButton>
                      </CardAddress>
                    </div>
                  ) : (
                    <SampleButton onClick={() => setShowForm(true)}>
                      Aggiungi indizzo
                    </SampleButton>
                  )}
                </Fragment>
              )}
            </div>
          </div>
        ) : (
          <div>
            {hasShippingAddress && hasBillingAddress ? (
              <div>
                Hello, you have both shipping and billing address set:
                <div>Fatturazione: Via Bonozzo Gozzoli, 5/4</div>
                <div>Spedizione: Via di Firenze, 40</div>
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
  ${tw`bg-gray-300 p-3 text-xs`}
`
