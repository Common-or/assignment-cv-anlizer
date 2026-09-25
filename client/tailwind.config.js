/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eef4ff', 500: '#4f46e5', 600: '#4338ca', 700: '#3730a3' },
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        beam: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(200%)' } },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
