import { FlexContainer } from "components/ui/FlexContainer"
import { type FC, forwardRef } from "react"

export const Top = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
  // biome-ignore lint/style/noParameterAssign: we pass the ref to the div
>((props, ref) => <div {...props} className="bg-white" ref={ref} />)

export const Bottom: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className="bg-gray-50" />
)

export const Main: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className="flex flex-col justify-center items-center text-center"
  />
)

export const Wrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className="flex flex-col p-5 md:p-10 lg:px-20 2xl:max-w-screen-2xl 2xl:mx-auto"
  />
)

export const Title: FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h1
    {...props}
    className="text-black text-2xl lg:text-4xl font-semibold mb-4"
  />
)

export const Text: FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => (
  <p {...props} className="py-2" />
)

export const WrapperButton: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="flex items-center justify-center w-full mt-8" />

export const Recap: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className="grid md:auto-cols-fr md:grid-flow-col md:gap-16 lg:gap-32"
  />
)

export const RecapSummary: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className="order-last border-t-2 border-dashed pt-6 md:order-first md:border-0 md:p-0"
  />
)

export const RecapCustomer: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="text-black order-1 md:order-2 mb-5 md:mb-0" />

export const RecapTitle: FC<React.HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => (
  <h2
    {...props}
    className="text-black text-lg font-semibold leading-none mb-8 md:mb-16"
  />
)

export const RecapCol: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className="mb-4 md:mb-8" />
)

export const RecapItemTitle: FC<React.HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => <h3 {...props} className="font-normal text-sm mb-2" />

export const RecapItem: FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => <p {...props} className="text-md font-bold" />

export const RecapItemDescription: FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = (props) => <p {...props} className="text-sm font-semibold" />

export const RecapBox: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className="p-3 rounded border" />
)

export const AddressContainer: FC<
  React.ComponentProps<typeof FlexContainer>
> = (props) => (
  <FlexContainer
    {...props}
    className="flex-col gap-y-4 xl:flex-row xl:gap-4 xl:justify-between [&>div]:flex-1"
  />
)
