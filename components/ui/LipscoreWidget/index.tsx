import Script from "next/script"
import React from "react"

declare global {
  interface Window {
    lipscore: {
      init: ({ apiKey }: { apiKey: string }) => void
      initWidgets: () => void
    }
    lipscoreInit: () => void
  }
}

export const LipscoreWidget: React.FC = () => {
  return (
    <>
      <div style={{ width: "100%" }}>
        <div
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="lipscore-rating-big"
          data-ls-product-name="Service reviews"
          data-ls-product-id="service_review"
          data-ls-product-url="http://www.nonstopdogwear.com"
        />
      </div>
      <Script
        strategy="afterInteractive"
        src="//static.lipscore.com/assets/en/lipscore-v1.js"
        onLoad={() => {
          window.lipscoreInit = function () {
            window.lipscore.init({
              apiKey: "085afa9dce79d98a3be9b9c6",
            })
          }
          window.lipscore.initWidgets()
        }}
      />
    </>
  )
}
