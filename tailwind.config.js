const colors = require("tailwindcss/colors")

module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ["Poppins", "ui-sans-serif", "sans-serif"],
    },
    colors: {
      ...colors,
      primary: "var(--primary)",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
