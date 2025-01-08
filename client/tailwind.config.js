/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: {
          DEFAULT: "#5E35B1",
          100: "#5E35B1",
          200: "#5E35B1",
        },
        territory: {
          DEFAULT: "#F49F1C",
          100: "#F49F1C",
          200: "#F49F1C",
        },
        black: {
          DEFAULT: "#000",
          100: "#303030",
          200: "#1E1E2D",
          300: "#232533",
        },
        gray: {
          100: "#CDCDE0",
          200: "#A8A8BA",
          300: "#83839A",
        },
      },
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
      textShadow: {
        sm: "0px 1px 2px rgba(0, 0, 0, 0.1)",
        md: "0px 2px 4px rgba(0, 0, 0, 0.25)",
        lg: "0px 4px 8px rgba(0, 0, 0, 0.4)",
      },
      boxShadow: {
        custom: "0px 4px 6px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-textshadow")],
};
