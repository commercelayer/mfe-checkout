import type { FC } from "react"

export const ButtonCss = [
  // Layout
  "items-center justify-center w-full lg:w-48",
  // Spacing and size
  "p-3",
  // Typography
  "text-xs font-extrabold text-contrast",
  // Colors and borders
  "bg-primary border border-primary rounded-md",
  // Transitions
  "transition duration-300 ease-in",
  // Interactive states
  "hover:bg-primary/80",
  "focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary",
  // Disabled states
  "disabled:bg-primary/50 disabled:border-primary/10",
  // Cursor
  "cursor-pointer disabled:cursor-default",
].join(" ")

export const ButtonWrapper: FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div {...props} className="flex justify-end" />

export const Button: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props,
) => <button {...props} className={`${ButtonCss} ${props.className || ""}`} />
