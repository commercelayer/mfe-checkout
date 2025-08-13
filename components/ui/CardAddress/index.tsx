interface Props {
  className?: string
  rounded?: boolean
  children?: ChildrenType
}

export const CardAddress: React.FC<Props> = ({ className, children }) => (
  <div
    className={`bg-white pb-10 px-4 shadow-md rounded-md p-5 ${className || ""}`}
  >
    {children}
  </div>
)
