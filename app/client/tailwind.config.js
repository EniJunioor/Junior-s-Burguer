/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      'sans': ['Roboto', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        "home": "url('src/assets/bg.png')"
      },
      colors: {
        primary: "#FFF2C3",
      }
    },
  },
  plugins: [],
}


