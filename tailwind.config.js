/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      keyframes: {
        progress: {
          from: { left: '-50%' },
          to: { left: '100%' },
        },
      },
      animation: {
        progress: 'progress 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
