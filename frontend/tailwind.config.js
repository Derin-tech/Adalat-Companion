/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Lora"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      colors: {
        govt: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          600: '#102a43',
          700: '#0b69a3',
          800: '#035388',
          900: '#0b1b3d',
          gold: '#c69214',
        }
      }
    },
  },
  plugins: [],
}
