/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgba(255, 255, 255, 1)",
          100: "rgba(255, 255, 255, 1)",
          200: "rgb(232, 232, 232)",
        },
        secondary: {
          DEFAULT: "rgba(94, 53, 177, 1)",
          100: "rgba(94, 53, 177, 1)",
          200: "rgba(94, 53, 177, 1)",
          300: "rgba(205, 173, 251, 1)",
          "100-40": "rgba(113, 43, 252, 0.4)",
          "200-40": "rgba(108, 36, 255, 0.4)",
        },
        territory: {
          DEFAULT: "rgba(244, 159, 28, 1)",
          100: "rgba(244, 159, 28, 1)",
          200: "rgba(244, 159, 28, 1)",
          "100-40": "rgb(255, 210, 147)",
        },
        black: {
          DEFAULT: "rgba(0, 0, 0, 1)",
          100: "rgba(48, 48, 48, 1)",
          200: "rgba(30, 30, 45, 1)",
          300: "rgba(35, 37, 51, 1)",
        },
        gray: {
          100: "rgba(205, 205, 224, 1)",
          200: "rgba(168, 168, 186, 1)",
          300: "rgba(131, 131, 154, 1)",
          400: "rgba(205, 205, 224, 1)",
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
        sm: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0px 10px 15px rgba(0, 0, 0, 0.2)",
        xl: "0px 20px 25px rgba(0, 0, 0, 0.3)",
        custom: "0px 4px 6px rgba(0, 0, 0, 0.5)",
        imageShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
        viewShadow: "0px 5px 15px rgba(0, 0, 0, 0.25)",
      },
      borderStyle: {
        dashed: "dashed",
      },
    },
  },

  plugins: [require("tailwindcss-textshadow")],
};
