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
        "primary-focus": "#1e74b3", // Darker shade for hover states
        secondary: "#67CBA0",
        "secondary-focus": "#4eb98e", // Darker shade for hover states
        accent: "#eab308",
        "accent-focus": "#ca9a06", // Darker shade for hover states
        neutral: "#181A2A",
        "base-100": "#ffffff",
        "base-200": "#f8f8f8",
        info: "#3ABFF8",
        success: "#36D399",
        warning: "#FBBD23",
        error: "#F87272",
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
  plugins: [require("@tailwindcss/aspect-ratio")],
};
