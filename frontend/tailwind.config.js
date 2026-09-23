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
        // macOS Dark Palette (Neutral dark charcoal canvas)
        macdark: {
          bg: '#0d0f12',
          surface: '#14171d',
          card: '#1a1e26',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.15)',
        },
        // Restrained macOS System Blue Accent
        macblue: {
          50: '#F0F6FF',
          100: '#E0EDFE',
          200: '#BAE0FD',
          500: '#007AFF',
          600: '#0062CC',
          700: '#0051A8',
        },
        // Subtle restrained status accents
        macstatus: {
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'mac': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        'mac-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
      },
    },
  },
  plugins: [],
};
