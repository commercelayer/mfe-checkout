interface Props {
  className?: string
  children?: JSX.Element[] | JSX.Element
}

export const GridContainer = ({ children, className }: Props): JSX.Element => (
  <div className={`grid gap-y-4 lg:grid-cols-2 lg:gap-4 ${className || ""}`}>
    {children}
  </div>
)
