export const GA_TRACKING_ID = "GTM-TGCQ5BM" //process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, params }) => {
  window.gtag("event", action, params)
}
