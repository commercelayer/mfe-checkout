export const getSubdomain = (hostname: string) => {
  return process.env.NEXT_PUBLIC_HOSTED
    ? hostname?.split(":")[0].split(".")[0]
    : (process.env.NEXT_PUBLIC_SLUG as string)
}
