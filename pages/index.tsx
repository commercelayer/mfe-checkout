import "twin.macro"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"

import SpinnerLoader from "components/ui/SpinnerLoader"

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/invalid")
  }, [])

  return <SpinnerLoader />
}

export default Home
