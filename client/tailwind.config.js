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
          300: "rgb(205, 173, 251)",
          "100-40": "rgba(113, 43, 252, 0.4)",
          "200-40": "rgba(108, 36, 255, 0.4)",
        },
        territory: {
          DEFAULT: "#F49F1C",
          100: "#F49F1C",
          200: "#F49F1C",
          "100-40": "rgba(254, 163, 36,0.5)",
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
        sm: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0px 10px 15px rgba(0, 0, 0, 0.2)",
        xl: "0px 20px 25px rgba(0, 0, 0, 0.3)",
        custom: "0px 4px 6px rgba(0, 0, 0, 0.5)",
        imageShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)", // Specific for images
        viewShadow: "0px 5px 15px rgba(0, 0, 0, 0.25)", // Specific for views
      },
      borderStyle: {
        dashed: "dashed",
      },
    },
  },

  plugins: [require("tailwindcss-textshadow")],
};
