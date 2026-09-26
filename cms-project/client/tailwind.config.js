/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f6fa',
          100: '#e6eaf2',
          400: '#5b6a8c',
          600: '#33405e',
          800: '#1c2438',
          900: '#12172a',
        },
        brass: {
          400: '#d9a94b',
          500: '#c9962c',
          600: '#a97a1e',
        },
        paper: '#eef1f4',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
