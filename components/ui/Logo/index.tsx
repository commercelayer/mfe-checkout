import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  logoUrl: string
  companyName: string
  className?: string
}

export const Logo: React.FC<Props> = ({ logoUrl, companyName, className }) => {
  return <Image src={logoUrl} alt={companyName} className={className} />
}

const Image = styled.img`
  ${tw`w-60 max-w-full mb-5 md:mb-10`}
`
