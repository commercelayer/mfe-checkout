interface Props {
  className?: string
  children?: ChildrenType
}

export const FlexContainer: React.FC<Props> = ({ children, className }) => (
  <div className={`flex ${className || ""}`}>{children}</div>
)
