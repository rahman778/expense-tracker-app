import formsPlugin from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5B6AD0",
        secondary: "#ecc94b",
      },
      borderRadius: {
        xs: "0.125rem",
        sm: "3px",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      fontSize: {
        md: "15px",
      },
    },
  },
  plugins: [formsPlugin],
};
