import { Logo } from "components/ui/Footer/cl"
import type { FC } from "react"

export const Main: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className="flex flex-col flex-1 justify-center items-center text-center"
  />
)

export const Wrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className="flex flex-wrap justify-end items-stretch flex-col h-screen p-5 md:p-10 lg:px-20 lg:pb-10"
  />
)

export const Text: FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => (
  <p {...props} className="p-4 text-sm font-normal text-gray-500" />
)

export const StyledError: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="flex flex-col items-center md:flex-row" />

export const ErrorCode: FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => (
  <p
    {...props}
    className="p-4 text-xl font-bold border-gray-300 text-gray-800 border-b md:border-r md:border-b-0"
  />
)

export const LogoWrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="md:max-w-xs" />

export const FullLogo: FC<React.ComponentProps<typeof Logo>> = (props) => (
  <Logo {...props} className={`text-black ${props.className || ""}`} />
)
