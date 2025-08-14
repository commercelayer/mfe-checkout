// Next.js React Component
// This component is designed for use in a Next.js project

import Image from "next/image"
import React from "react"

interface RenewUsHeaderProps {
  logo: HeaderLogo
}

export default function RenewUsHeader({ logo }: RenewUsHeaderProps) {
  return (
    <header className="bg-light flex h-16 w-full items-center justify-center px-3 py-2 -mb-5">
      {logo?.image && (
        <div className="flex h-12 w-36 items-center justify-center">
          <Image
            className="max-h-12 w-fit max-w-36 object-contain"
            src={logo.image}
            alt={logo.alt || "Logo"}
            width={144}
            height={48}
            priority
          />
        </div>
      )}
    </header>
  )
}
