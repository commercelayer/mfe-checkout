/**
 * PROTOTYPE — throwaway code, see README.md
 */
import classNames from "classnames"
import type { FC } from "react"

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The wallet containers stay mounted even before a wallet is available,
   * because Adyen mounts into them: while empty the block collapses to nothing
   * instead of showing an empty bordered box.
   */
  isEmpty?: boolean
}

export const ExpressWrapper: FC<WrapperProps> = ({ isEmpty, ...props }) => (
  <div
    {...props}
    className={classNames("flex flex-col", { "mt-7 pt-6 border-t": !isEmpty })}
  />
)

export const ExpressTitle: FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => (
  <p
    {...props}
    className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500"
  />
)

export const ExpressButtons: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="flex flex-col gap-2" />

export const ExpressError: FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => <p {...props} className="mt-3 text-xs text-red-400" />

export const ExpressHint: FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => <p {...props} className="mt-3 text-xs text-gray-400" />

/** Floating panel: the prototype narrates every step it takes. */
export const PanelWrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className="fixed bottom-0 left-0 z-50 w-full md:w-96 max-h-64 overflow-auto bg-black/90 text-white text-[11px] leading-relaxed font-mono p-3 rounded-t-md"
  />
)

export const PanelHeader: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => (
  <div
    {...props}
    className="flex justify-between gap-2 pb-2 mb-2 border-b border-white/20 uppercase tracking-wide"
  />
)

export const PanelRow: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} className="flex gap-2" />
)

export const PanelTime: FC<React.HTMLAttributes<HTMLSpanElement>> = (props) => (
  <span {...props} className="text-white/40 shrink-0" />
)

export const PanelDetail: FC<React.HTMLAttributes<HTMLSpanElement>> = (
  props,
) => <span {...props} className="text-white/50 truncate" />
