import { Base } from "components/ui/Base"
import { Card } from "components/ui/Card"
import { Container } from "components/ui/Container"
import type { FC } from "react"

interface Props {
  aside: React.ReactNode
  main: React.ReactNode
}

export const LayoutDefault: FC<Props> = ({ main, aside }) => {
  return (
    <Base>
      <Container>
        <div className="flex flex-wrap justify-end items-stretch flex-col min-h-full md:h-screen md:flex-row">
          <div className="flex-none md:flex-1">{aside}</div>
          <div className="flex-none md:flex-1 justify-center order-first md:order-last">
            <Card fullHeight>{main}</Card>
          </div>
        </div>
      </Container>
    </Base>
  )
}
