/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6', // blue-500
          dark: '#1e40af', // blue-800
        },
        accent: '#e0f2fe', // light blue background
      },
      borderRadius: {
        xl: '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
