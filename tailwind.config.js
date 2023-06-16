const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      screens: {
        sm: "100%",
        md: "100%",
        lg: "100%",
      },
    },
    colors: {
      primary: {
        light: "var(--primary-light)",
        DEFAULT: "var(--primary)",
        dark: "var(--primary-dark)",
      },
      contrast: "var(--contrast)",
      transparent: "transparent",
      black: "#101111",
      white: "#fff",
      gray: {
        // 100: "#f8f8f8",
        // 300: "#E6E6E6",
        // 400: "#C4C4C4",
        // 500: "#8D8D8D",
        // 600: "#666666",
        50: "#f8f8f8",
        100: "#EDEEEE",
        200: "#E6E7E7",
        300: "#DBDCDC",
        400: "#878888",
        500: "#686E6E",
        600: "#404141",
        700: "#343535",
        800: "#282929",
        900: "#1D1E1E",
      },
      red: {
        50: "#ffe0e1",
        400: "#FF656B",
        500: "#cc5156",
      },
      green: {
        400: "#1FDA8A",
      },
      orange: {
        400: "#FFAB2E",
      },
    },
    fontFamily: {
      sans: ["Manrope", "ui-sans-serif", "sans-serif"],
    },
    borderColor: (theme) => ({
      ...theme("colors"),
      DEFAULT: theme("colors.gray.200", "currentColor"),
    }),
    extend: {
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
        inner: "0 0 0px 1000px #fff inset",
        top: "0px -4px 1px 0px rgb(0, 0, 0, 0.025)",
      },
      transitionProperty: {
        bg: "background",
      },
    },
  },
  variants: {
    extend: {
      textColor: ["group-focus"],
      maxHeight: ["group-focus"],
      opacity: ["disabled"],
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/line-clamp"),
  ],
}
