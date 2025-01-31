/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgba(255, 255, 255, 1)",
          dark: "rgba(30, 30, 30, 1)",
          100: "rgba(255, 255, 255, 1)",
          200: "rgb(232, 232, 232)",
        },
        secondary: {
          DEFAULT: "rgba(94, 53, 177, 1)",
          dark: "rgba(200, 200, 255, 1)",
          100: "rgba(94, 53, 177, 1)",
          200: "rgba(94, 53, 177, 1)",
          300: "rgba(205, 173, 251, 1)",
          "100-40": "rgba(113, 43, 252, 0.4)",
          "200-40": "rgba(108, 36, 255, 0.4)",
        },
        territory: {
          DEFAULT: "rgba(244, 159, 28, 1)",
          dark: "rgba(255, 180, 50, 1)",
          100: "rgba(244, 159, 28, 1)",
          200: "rgba(244, 159, 28, 1)",
          "100-40": "rgb(255, 210, 147)",
        },
        black: {
          DEFAULT: "rgba(0, 0, 0, 1)",
          dark: "rgba(255, 255, 255, 1)",
          100: "rgba(48, 48, 48, 1)",
          200: "rgba(30, 30, 45, 1)",
          300: "rgba(35, 37, 51, 1)",
        },
        gray: {
          DEFAULT: "rgba(168, 168, 186, 1)",
          dark: "rgba(100, 100, 100, 1)",
          100: "rgba(205, 205, 224, 1)",
          200: "rgba(168, 168, 186, 1)",
          300: "rgba(131, 131, 154, 1)",
          400: "rgba(205, 205, 224, 1)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-textshadow")],
};
