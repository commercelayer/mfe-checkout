interface Props {
  label: string
  checked: boolean
  onChange: () => void
  className?: string
  disabled: boolean
}

export const Toggle: React.FC<Props> = ({
  label,
  checked,
  onChange,
  className,
  disabled,
  ...rest
}) => {
  return (
    <div className="mt-5 py-4 border-t">
      <label className={`flex items-center ${className ?? ""}`}>
        <button
          type="button"
          disabled={disabled}
          onClick={onChange}
          data-state={checked ? "checked" : "unchecked"}
          className="relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-gray-200 data-[state=checked]:bg-primary"
          {...rest}
        >
          <span className="sr-only">Use setting</span>
          <span
            className="inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-3"
            aria-hidden="true"
            data-state={checked ? "checked" : "unchecked"}
          />
        </button>
        <span className="ml-2 text-sm text-gray-500">{label}</span>
      </label>
    </div>
  )
}
