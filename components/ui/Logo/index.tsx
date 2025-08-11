interface Props {
  logoUrl: NullableType<string>
  companyName: string
  className?: string
}

export const Logo: React.FC<Props> = ({ logoUrl, companyName, className }) => {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={companyName}
        className={`w-60 max-w-full mb-5 md:mb-10 ${className || ""}`}
      />
    )
  }
  return (
    <h1
      className={`mb-5 md:mb-12 font-extrabold uppercase tracking-wide text-xl text-black ${className || ""}`}
    >
      {companyName}
    </h1>
  )
}
