/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "rgba(255, 255, 255, 1)",
          dark: "rgba(42, 35, 58,1)",
          100: "rgba(255, 255, 255, 1)",
          200: "rgb(232, 232, 232)",
        },
        secondary: {
          DEFAULT: "rgba(94, 53, 177, 1)",
          dark: "rgba(31, 23, 49, 1)",
          darkText: "rgb(171, 118, 246)",
          darkBox: "rgba(217, 202, 246, 0.19)",
          darkBorder: "rgba(163, 121, 249, 0.39)",
          lightBox: "rgba(141, 80, 255, 0.34)",
          lightBorder: "rgba(141, 80, 255, 0.59)",
          100: "rgba(94, 53, 177, 1)",
          200: "rgba(94, 53, 177, 1)",
          300: "rgba(205, 173, 251, 1)",
        },
        territory: {
          DEFAULT: "rgba(244, 159, 28, 1)",
          dark: "rgba(255, 180, 50, 1)",
          darkBox: "rgb(137, 99, 34)",
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
