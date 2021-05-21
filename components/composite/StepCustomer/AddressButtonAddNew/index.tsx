import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  onClick: () => void
}

export const AddressButtonAddNew: React.FC<Props> = ({ children, onClick }) => {
  return (
    <Wrapper>
      <Button onClick={onClick} data-cy="add-new-billing-address">
        {children}
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex  my-2`}
`

const Button = styled.p`
  ${tw`inline-flex text-sm font-bold text-primary border-b leading-none border-black border-opacity-10 md: transition ease-in duration-200 hover:border-opacity-50 hover:text-primary-dark`}
`
