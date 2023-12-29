const colors = {
  black: "#000",
  grey: "#7b8ca4",
  highlight: "#e5e5e9",
  light: "#fff0f8",
  light2: "#F7F2FA",
  lightGray: "#f8f4f4",
  lightGray2: "#d4d4d4",
  mediumGray: "#888889",
  primary: "#ed4297",
  red: "#c93a3a",
  secondary: "#4ecdc4",
  white: "#fff",
  iosBackground: "#f2f2f6",
  green: "green",
  yellow: "#FBC02D",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx", "./App.tsx"],
  theme: {
    extend: {
      colors,
    },
  },
  plugins: [],
  colors,
};
