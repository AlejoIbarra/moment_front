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
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Noto Serif"', 'serif'],
      },
      colors: {
        // Official Moments Brand Scale (Obsidian Black + Pure White + Electric Green #3EF4A1)
        moments: {
          neon: '#3ef4a1',
          emerald: '#07b667',
          deep: '#079054',
          obsidian: '#09090b',
          ink: '#18181b',
        },
        // Unified primary interactive tokens (removes legacy indigo/purple/violet clashes across all views)
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
        },
        purple: {
          50: '#eafff4',
          100: '#cdffe6',
          200: '#a0ffd3',
          300: '#64fcbd',
          400: '#3ef4a1',
          500: '#10b981',
          600: '#09090b',
          700: '#079054',
          800: '#0a7144',
          900: '#09090b',
          950: '#050507',
        },
        violet: {
          50: '#eafff4',
          100: '#cdffe6',
          200: '#a0ffd3',
          300: '#64fcbd',
          400: '#3ef4a1',
          500: '#10b981',
          600: '#09090b',
          700: '#079054',
          800: '#0a7144',
          900: '#09090b',
          950: '#050507',
        }
      }
    },
  },
  plugins: [],
}
