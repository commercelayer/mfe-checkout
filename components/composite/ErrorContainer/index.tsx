import { Base } from "components/ui/Base"
import { Container } from "components/ui/Container"
import { Footer } from "components/ui/Footer"
import { Logo } from "components/ui/Footer/cl"

export const ErrorContainer = ({ children }: { children: ChildrenType }) => {
  return (
    <Base>
      <Container>
        <div className="flex flex-wrap justify-end items-stretch flex-col h-screen p-5 md:p-10 lg:px-20 lg:pb-10">
          <div className="md:max-w-xs">
            <div className="self-center text-black md:pl-4 md:self-auto">
              <Logo />
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-center items-center text-center">
            <div className="flex flex-col items-center md:flex-row">
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </Container>
    </Base>
  )
}
