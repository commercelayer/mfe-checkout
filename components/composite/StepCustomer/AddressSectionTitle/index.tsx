import type { FC } from "react"

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
}

export const AddressSectionTitle: FC<Props> = ({ children, ...props }) => {
  return (
    <h3 {...props} className="mt-4 mb-2 font-normal text-black text-sm">
      {children}
    </h3>
  )
}
