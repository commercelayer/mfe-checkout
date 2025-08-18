import { Logo } from "./cl"

export const Footer: React.FC = () => {
  return (
    <div className="footer-wrapper md:flex fixed w-full bottom-0 justify-start items-center border-t -mx-5 px-5 py-2 text-xs text-gray-400 bg-gray-50 z-30 md:bottom-0 md:sticky md:p-0 md:py-3 md:m-0 md:mt-20">
      <div className="flex items-center">
        Powered by <Logo width="135" height="22" className="pl-2" />
      </div>
    </div>
  )
}
