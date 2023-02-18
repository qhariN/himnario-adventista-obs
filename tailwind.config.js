module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      green: "#00C853",
      red: "#D50000",
      blue: "#1E88E5",
      yellow: "#FFD600",
      muted: "#9E9E9E",
      light: {
        background: "#E5E5E5",
        button: {
          bg: "#F3F3F3",
          hover: "#FEFEFF",
          active: "#C1C1C1",
        }
      },
      dark: {
        background: "#2B2E38",
        button: {
          bg: "#3C404B",
          hover: "#4F535E",
          active: "#191B26",
        }
      }
    }
  },
  plugins: [],
}
