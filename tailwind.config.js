/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2fb',
          100: '#fce7f8',
          200: '#fbcfee',
          300: '#f9a8df',
          400: '#f472cf',
          500: '#ec49bd',
          600: '#d72e9f',
          700: '#b81f82',
          800: '#971b6b',
          900: '#7d1a5a',
        },
      },
    },
  },
  plugins: [],
}
