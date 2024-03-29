/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{html,js,jsx,ts,tsx}",
    "./lib/**/*.{html,js,jsx,ts,tsx}",
    "./components/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#268bd2",
        nickels: "#fefff5",
        dimes: "#f5fff8",
        quarters: "#f5fcff",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        icons: ["var(--font-icons)"],
      },
      animation: {
        "delayed-fade-in": "fade-in 75ms ease-in 300ms 1 normal forwards",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/aspect-ratio")],
  daisyui: {
    themes: [
      {
        ewal: {
          primary: "#268bd2",
          secondary: "#67CBA0",
          accent: "#eab308",
          neutral: "#181A2A",
          "base-100": "#ffffff",
          "base-200": "#f8f8f8",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
};
