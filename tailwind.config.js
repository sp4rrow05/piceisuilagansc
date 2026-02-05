/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pice: {
          navy: "#0F172A",
          dark: "#020617",
          gold: "#F59E0B",
          orange: "#FB923C",
          light: "#F8FAFC",
          gray: "#CBD5E1",
        },
      },
    },
  },
  plugins: [],
}
