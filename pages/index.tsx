import type { NextPage } from "next"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Page404 from "./404"
import Order from "./Order"

const Home: NextPage = () => {
  return (
    <BrowserRouter basename={process.env.NEXT_PUBLIC_BASE_PATH}>
      <Routes>
        <Route path="404" element={<Page404 />} />
        <Route path=":orderId" element={<Order />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Home
