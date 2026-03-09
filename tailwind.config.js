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
        // 旧色（保留兼容）
        theme_dark: "#0C0C0C",
        theme_dark_sm: "#121212",
        theme_zinc: "rgb(112, 26, 255)",
        theme_gray: "#4b5563",
        theme_blue: "#165dff",
        // 主题色阶
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#165dff",
          600: "#1252e0",
          700: "#0f47c2",
          800: "#0c3ca3",
          900: "#0a3185",
          DEFAULT: "#165dff",
        },
        // 统一页面背景色
        page: "#f7f8fa",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 10px 24px rgba(22, 93, 255, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
