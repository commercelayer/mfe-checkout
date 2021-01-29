const colors = require("tailwindcss/colors")

module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ["Poppins", "ui-sans-serif", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "var(--primary)",
        contrast: "var(--contrast)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
