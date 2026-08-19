/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eafff4',
          100: '#cdffe6',
          200: '#a0ffd3',
          300: '#64fcbd',
          400: '#3ef4a1',
          500: '#13de84',
          600: '#07b667',
          700: '#079054',
          800: '#0a7144',
          900: '#095c39',
          950: '#02341f',
        }
      }
    },
  },
  plugins: [],
}
