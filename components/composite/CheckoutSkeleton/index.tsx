import styled from "styled-components"
import tw from "twin.macro"

import { LayoutDefault } from "components/layouts/LayoutDefault"

export const CheckoutSkeleton: React.FC = () => {
  return (
    <LayoutDefault
      aside={
        <Sidebar>
          <div className="mb-12 flex animate-pulse">
            <SkeletonCircle className="mr-5 size-10" />
            <SkeletonBox className="h-10 w-1/2 bg-gray-200" />
          </div>
          <SummaryWrapper>
            <div className="animate-pulse">
              <SkeletonBox className="h-6 w-2/6 bg-gray-200" />
              <SkeletonBox className="mt-2 h-4 w-1/2 bg-gray-200" />
              <div className="my-8 flex">
                <SkeletonBox className="mr-6 size-24" />
                <div className="flex flex-1 flex-col gap-3">
                  <SkeletonBox className="h-3 w-1/2" />
                  <SkeletonBox className="h-6 w-full" />
                  <SkeletonBox className="h-3 w-2/5" />
                  <SkeletonBox className="h-6 w-1/5" />
                </div>
              </div>
              <div className="flex flex-col md:ml-30">
                <SkeletonBox className="mb-10 mt-5 h-12 w-full" />
                <div className="mt-2 flex justify-between">
                  <SkeletonBox className="h-4 w-2/4" />
                  <SkeletonBox className="h-4 w-1/5" />
                </div>
                <div className="mt-2 flex justify-between">
                  <SkeletonBox className="h-4 w-2/4" />
                  <SkeletonBox className="h-4 w-1/5" />
                </div>
                <div className="mt-2 flex justify-between">
                  <SkeletonBox className="h-4 w-2/4" />
                  <SkeletonBox className="h-4 w-1/5" />
                </div>
                <div className="mt-12 flex justify-between">
                  <SkeletonBox className="h-6 w-1/4" />
                  <SkeletonBox className="h-6 w-1/5" />
                </div>
              </div>
            </div>
          </SummaryWrapper>
        </Sidebar>
      }
      main={
        <div className="animate-pulse">
          <div className="flex flex-row items-baseline justify-between">
            <SkeletonBox className="h-10 w-40" />
            <SkeletonBox className="hidden h-6 w-20 md:block" />
          </div>
          <div className="flex items-baseline justify-between">
            <SkeletonBox className="mt-10 h-6 w-2/5 md:mt-5 md:w-4/6" />
            <SkeletonBox className="block h-6 w-20 md:hidden" />
          </div>
          <div className="mt-16 flex">
            <div className="mr-5 w-8">
              <SkeletonCircle className="size-8" />
            </div>
            <div className="w-full">
              <SkeletonBox className="mb-3 h-6 w-4/6" />
              <SkeletonBox className="h-3 w-2/5" />
            </div>
          </div>
          <div className="mt-16 flex">
            <div className="mr-5 w-8">
              <SkeletonCircle className="size-8" />
            </div>
            <div className="w-full">
              <SkeletonBox className="mb-3 h-6 w-4/6" />
              <SkeletonBox className="h-3 w-2/5" />
            </div>
          </div>
          <div className="mt-16 flex">
            <div className="mr-5 w-8">
              <SkeletonCircle className="size-8" />
            </div>
            <div className="w-full">
              <SkeletonBox className="mb-3 h-6 w-4/6" />
              <SkeletonBox className="h-3 w-2/5" />
            </div>
          </div>
          <div className="mt-16 flex justify-end">
            <SkeletonBox className="h-10 w-2/5" />
          </div>
        </div>
      }
    />
  )
}

const Sidebar = styled.div`
  ${tw`flex flex-col min-h-full p-5 md:px-8 lg:px-12 lg:pt-10 xl:px-24 xl:pt-12`}
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
