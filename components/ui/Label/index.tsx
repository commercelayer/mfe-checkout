interface Props {
  dataTestId?: string
  htmlFor: string
  textLabel?: string
  children?: ChildrenType
  className?: string
}

export const Label: React.FC<Props> = ({
  dataTestId,
  htmlFor,
  textLabel,
  children,
  className,
}) => {
  return (
    <label
      data-testid={dataTestId}
      htmlFor={htmlFor}
      className={`ml-2 cursor-pointer text-sm text-gray-500 [&.hasError]:text-red-400 [&_a]:text-gray-900 [&_a]:border-b [&_a]:border-gray-200 [&_a]:transition [&_a]:ease-in-out [&_a:hover]:text-gray-500 ${className ?? ""}`}
    >
      {children || textLabel}
    </label>
  )
}
