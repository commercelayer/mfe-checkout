import { LineItemCode } from "@commercelayer/react-components/line_items/LineItemCode"
import { LineItemOptions } from "@commercelayer/react-components/line_items/LineItemOptions"
import type { FC } from "react"

export const LineItemWrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="flex flex-row mb-7 pb-6 border-b" />

export const LineItemDescription: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="pl-4 flex flex-col flex-1 lg:pl-8" />

export const LineItemTitle: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="flex justify-between text-black" />

export const LineItemQty: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className="text-xs bg-gray-100 max-w-max py-1 px-2.5 rounded lowercase text-gray-500 font-bold first-letter:uppercase"
  />
)

export const LineItemFrequency: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className="mt-2 flex bg-white border border-primary text-primary lg:mt-0 text-xs max-w-max py-1 px-2.5 rounded lowercase font-bold first-letter:uppercase"
  />
)

export const StyledLineItemSkuCode: FC<
  React.ComponentProps<typeof LineItemCode>
> = (props) => (
  <LineItemCode
    {...props}
    className={`text-xxs uppercase text-gray-400 font-bold mb-1 ${props.className || ""}`}
  />
)

export const StyledLineItemOptions: FC<
  React.ComponentProps<typeof LineItemOptions>
> = (props) => {
  const lineItemOptionsStyles = {
    h6: "[&>h6]:font-bold [&>h6]:text-xs [&>h6]:text-gray-600 [&>h6]:mt-2 [&>h6]:bg-no-repeat [&>h6]:bg-16 [&>h6]:pl-5 [&>h6]:bg-[url('data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLTUgdy01IiB2aWV3Qm94PSIwIDAgMjAgMjAiIGZpbGw9ImN1cnJlbnRDb2xvciI+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTAuMjkzIDUuMjkzYTEgMSAwIDAxMS40MTQgMGw0IDRhMSAxIDAgMDEwIDEuNDE0bC00IDRhMSAxIDAgMDEtMS40MTQtMS40MTRMMTIuNTg2IDExSDVhMSAxIDAgMTEwLTJoNy41ODZsLTIuMjkzLTIuMjkzYTEgMSAwIDAxMC0xLjQxNHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz4KPC9zdmc+')]",
    li: "[&_li]:text-gray-400 [&_li]:text-xs [&_li]:flex [&_li]:font-medium [&_li]:capitalize [&_li]:pl-5 [&_li]:pt-1 [&_li]:bg-no-repeat [&_li]:bg-16 [&_li]:not(span):font-medium [&_li]:last-of-type:mb-2",
    liSpan:
      "[&_li_span]:font-bold [&_li_span]:text-gray-500 [&_li_span]:ml-1 [&_li_span]:line-clamp-3 [&_li_span]:md:line-clamp-6",
  }
  return (
    <LineItemOptions
      {...props}
      className={`
        ${lineItemOptionsStyles.h6}
        ${lineItemOptionsStyles.li}
        ${lineItemOptionsStyles.liSpan}
      ${props.className || ""}
    `
        .trim()
        .replace(/\s+/g, " ")}
    />
  )
}
