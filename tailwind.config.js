const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  mode: "jit",
  theme: {
    container: {
      screens: {
        sm: "100%",
        md: "100%",
        lg: "100%",
      },
    },
    fontFamily: {
      sans: ["Manrope", "ui-sans-serif", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          light: "var(--primary-light)",
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
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
        green: {
          400: "#2BC48A",
        },
      },
      fontSize: {
        md: "0.938rem",
        ss: "0.813rem",
        xxs: "0.75rem",
      },
      backgroundSize: {
        16: "1rem",
      },
      width: {
        22: "5.75rem",
      },
      minHeight: {
        inherit: "inherit",
      },
      flex: {
        75: "0 0 75px",
        85: "0 0 85px",
      },
      margin: {
        30: "7.5rem",
      },
      boxShadow: {
        bottom: "0 2px 0 0 rgba(0, 0, 0, 0.05)",
        inner: "0 0 0 1000px rgba(255, 255, 255, 1) inset",
        top: "0px -4px 1px 0px rgb(0, 0, 0, 0.025)",
      },
    },
  },
  variants: {
    extend: {
      textColor: ["group-focus"],
      maxHeight: ["group-focus"],
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/line-clamp"),
  ],
}
