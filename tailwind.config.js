/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        vintage: {
          charcoal: '#2D2D2D',
          black: '#1A1A1A',
          cream: '#F4F1EA',
          rose: '#D2B4B4',
          sage: '#A5B5A5',
          gold: '#C5A880'
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'cinematic': '0 10px 40px -5px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
