const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    container: {
      screens: {
      sm: "100%",
      md: "100%",
      lg: "100%",
   }
  },
    fontFamily: {
      sans: ["Manrope", "ui-sans-serif", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "var(--primary)",
        primary: {
          light: "#b7dfb9",
          DEFAULT: "var(--primary)",
          dark: "#245225",
        },
        contrast: "var(--contrast)",
        gray: {
          100: "#f8f8f8",
          300: "#E6E6E6",
          400: "#C4C4C4",
          500: "#8D8D8D",
          600: "#666666",
        },
        red: {
          400: "#ED5959",
        },
      },
      fontSize: {
        md: "0.938rem",
        ss: "0.813rem",
        xxs: "0.75rem",
      },
      width: {
        22: "5.75rem",
      },
      flex: {
        '75': '0 0 75px',
        '85': '0 0 85px',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
