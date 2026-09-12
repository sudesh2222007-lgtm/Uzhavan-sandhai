/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        leaf: { 50: "#f2f8f0", 100: "#dfeeda", 300: "#a3d191", 500: "#4c8c37", 600: "#3c7029", 700: "#2f591f", 900: "#1c3812" },
        earth: { 50: "#faf6f0", 100: "#f0e4d3", 300: "#d9b98a", 500: "#b8834a", 700: "#8a5e30" },
        cream: "#fbf9f4",
      },
      fontFamily: {
        tamil: ["'Noto Sans Tamil'", "sans-serif"],
        display: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(60, 112, 41, 0.15)",
        glass: "0 8px 32px 0 rgba(31, 38, 15, 0.1)",
      },
      backdropBlur: { glass: "12px" },
    },
  },
  plugins: [],
};
