import styled from "styled-components"
import tw from "twin.macro"

import { LayoutDefault } from "components/layouts/LayoutDefault"

export const CheckoutSkeleton: React.FC = () => {
  return (
    <LayoutDefault
      aside={
        <Sidebar>
          <div className="flex mb-12 animate-pulse">
            <SkeletonCircle className="w-10 h-10 mr-5" />
            <SkeletonBox className="w-1/2 h-10 bg-gray-200" />
          </div>
          <SummaryWrapper>
            <div className="animate-pulse">
              <SkeletonBox className="w-2/6 h-6 bg-gray-200" />
              <SkeletonBox className="w-1/2 h-4 mt-2 bg-gray-200" />
              <div className="flex my-8">
                <SkeletonBox className="w-24 h-24 mr-6" />
                <div className="flex flex-col flex-1 gap-3">
                  <SkeletonBox className="w-1/2 h-3" />
                  <SkeletonBox className="w-full h-6" />
                  <SkeletonBox className="w-2/5 h-3" />
                  <SkeletonBox className="w-1/5 h-6" />
                </div>
              </div>
              <div className="flex flex-col md:ml-30">
                <SkeletonBox className="w-full h-12 mt-5 mb-10" />
                <div className="flex justify-between mt-2">
                  <SkeletonBox className="w-2/4 h-4" />
                  <SkeletonBox className="w-1/5 h-4" />
                </div>
                <div className="flex justify-between mt-2">
                  <SkeletonBox className="w-2/4 h-4" />
                  <SkeletonBox className="w-1/5 h-4" />
                </div>
                <div className="flex justify-between mt-2">
                  <SkeletonBox className="w-2/4 h-4" />
                  <SkeletonBox className="w-1/5 h-4" />
                </div>
                <div className="flex justify-between mt-12">
                  <SkeletonBox className="w-1/4 h-6" />
                  <SkeletonBox className="w-1/5 h-6" />
                </div>
              </div>
            </div>
          </SummaryWrapper>
        </Sidebar>
      }
      main={
        <div className="animate-pulse">
          <div className="flex flex-row items-baseline justify-between">
            <SkeletonBox className="w-40 h-10" />
            <SkeletonBox className="hidden w-20 h-6 md:block" />
          </div>
          <div className="flex items-baseline justify-between">
            <SkeletonBox className="w-2/5 h-6 mt-10 md:w-4/6 md:mt-5" />
            <SkeletonBox className="block w-20 h-6 md:hidden" />
          </div>
          <div className="flex mt-16">
            <div className="w-8 mr-5">
              <SkeletonCircle className="w-8 h-8" />
            </div>
            <div className="w-full">
              <SkeletonBox className="w-4/6 h-6 mb-3" />
              <SkeletonBox className="w-2/5 h-3" />
            </div>
          </div>
          <div className="flex mt-16">
            <div className="w-8 mr-5">
              <SkeletonCircle className="w-8 h-8" />
            </div>
            <div className="w-full">
              <SkeletonBox className="w-4/6 h-6 mb-3" />
              <SkeletonBox className="w-2/5 h-3" />
            </div>
          </div>
          <div className="flex mt-16">
            <div className="w-8 mr-5">
              <SkeletonCircle className="w-8 h-8" />
            </div>
            <div className="w-full">
              <SkeletonBox className="w-4/6 h-6 mb-3" />
              <SkeletonBox className="w-2/5 h-3" />
            </div>
          </div>
          <div className="flex justify-end mt-16">
            <SkeletonBox className="w-2/5 h-10" />
          </div>
        </div>
      }
    />
  )
}

const Sidebar = styled.div`
  ${tw`flex flex-col min-h-full p-5 lg:pl-20 lg:pr-10 pt-10 xl:pl-48`}
`
const SummaryWrapper = styled.div`
  ${tw`flex-1`}
`
const SkeletonBox = styled.div`
  ${tw`bg-gray-200 rounded-xl`}
`
const SkeletonCircle = styled(SkeletonBox)`
  ${tw`rounded-full`}
`

export default CheckoutSkeleton
