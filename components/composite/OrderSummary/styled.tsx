import type { FC } from "react"

export const Wrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} />
)

export const SummaryHeader: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="mb-12" />

export const SummaryTitle: FC<React.HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => <h2 {...props} className="text-xl text-black font-semibold" />

export const SummarySubTitle: FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => <p {...props} className="text-gray-400" />

export const TotalWrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="flex flex-row" />

export const AmountWrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="flex flex-col flex-1 pb-32 md:pb-0 lg:pl-8" />

export const AmountSpacer: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="hidden lg:flex lg:flex-85" />

export const RecapLine: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    {...props}
    className={`flex flex-row justify-between py-0.5 text-black ${!props.children ? "hidden" : ""}`}
  />
)

export const RecapLineItem: FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => <p {...props} className="font-semibold" />

export const RecapLineTotal: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className={`flex flex-row justify-between py-0.5 text-black border-t border-gray-400 mt-7 pt-6 ${!props.children ? "hidden" : ""}`}
  />
)

export const RecapLineItemTotal: FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = (props) => (
  <p {...props} className="text-xl font-semibold invisible lg:visible" />
)
