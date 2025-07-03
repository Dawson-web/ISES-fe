/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "600px",
        md: "900px",
        lg: "1200px",
        slg: "1800px",
      },
    },
    extend: {
      colors: {
        theme_dark: "#0C0C0C",
        theme_dark_sm: "#121212",
        theme_zinc: "rgb(112, 26, 255)",
        theme_gray: "#4b5563",
        theme_blue: "#165dff",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
