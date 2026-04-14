/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",   // deep blue
        secondary: "#3B82F6", // soft blue
        lightbg: "#F9FAFB",
      },
    },
  },
  plugins: [],
};
