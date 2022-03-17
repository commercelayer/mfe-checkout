import Link from "next/link"

import { CartLinkWrapper, LinkWrapper } from "./styled"

interface Props {
  cartUrl: string | undefined
}

export const ReturnToCart = ({ cartUrl }: Props) => {
  if (!cartUrl) return <></>
  return (
    <CartLinkWrapper>
      <Link href={cartUrl} passHref>
        <LinkWrapper>
          <>&lt;</> Return to cart
        </LinkWrapper>
      </Link>
    </CartLinkWrapper>
  )
}
