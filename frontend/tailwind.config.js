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
        blue: "#268bd2",
      },
    },
  },
  plugins: [require("daisyui")],
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
