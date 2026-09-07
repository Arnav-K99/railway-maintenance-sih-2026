/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          500: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#0F172A',
        },
      },
    },
  },
  plugins: [],
};
