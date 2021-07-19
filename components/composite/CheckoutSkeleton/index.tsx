import styled from "styled-components"
import tw from "twin.macro"

import { LayoutDefault } from "components/layouts/LayoutDefault"

export const CheckoutSkeleton: React.FC = () => {
  return (
    <LayoutDefault
      aside={
        <Sidebar>
          <div className="animate-pulse">
            <div className="w-1/2 h-16 mb-8 bg-gray-200" />
          </div>
          <SummaryWrapper>
            <div className="animate-pulse">
              <div className="w-1/2 h-5 bg-gray-200" />
              <div className="w-1/2 h-5 mt-2 bg-gray-200" />
              <div className="h-20 mt-5 bg-gray-200" />
              <div className="grid justify-items-end">
                <div className="w-3/4 mt-5 bg-gray-200 h-60" />
              </div>
            </div>
          </SummaryWrapper>
        </Sidebar>
      }
      main={
        <div className="animate-pulse">
          <div className="flex flex-row items-baseline justify-between">
            <div className="w-40 h-10 bg-gray-200" />
            <div className="w-40 h-8 bg-gray-200" />
          </div>
          <div className="h-5 mt-5 bg-gray-200" />
          <div className="w-auto mt-5 bg-gray-200 h-60" />
          <div className="w-auto mt-5 bg-gray-200 h-60" />
        </div>
      }
    />
  )
}

const Sidebar = styled.div`
  ${tw`flex flex-col min-h-full p-5 lg:pl-20 lg:pr-10 lg:pt-10 xl:pl-48 bg-gray-100`}
`
const SummaryWrapper = styled.div`
  ${tw`flex-1`}
`
export default CheckoutSkeleton
