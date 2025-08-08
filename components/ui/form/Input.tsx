export const InputCss = [
  // Base styles
  "text-black block w-full border-gray-300 border rounded-md shadow-sm p-3",
  "transition duration-100 ease-in-out",
  "focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary-light focus:ring-opacity-50",
  "sm:text-sm",
  // Autofill styles
  "[&:-webkit-autofill]:shadow-inner",
  "[&:-webkit-autofill]:transition-bg [&:-webkit-autofill]:duration-[5000s] [&:-webkit-autofill]:ease-in-out [&:-webkit-autofill]:delay-[0ms]",
  "[&:-webkit-autofill:focus]:shadow-inner",
  "[&:-webkit-autofill:focus]:transition-bg [&:-webkit-autofill:focus]:duration-[5000s] [&:-webkit-autofill:focus]:ease-in-out [&:-webkit-autofill:focus]:delay-[0ms]",
].join(" ")
