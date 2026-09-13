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
        // macOS Neutral Dark Mode Palette
        macdark: {
          bg: '#0d0f12',         // Very dark charcoal / near-black
          surface: '#14171d',    // Slightly lighter charcoal
          panel: 'rgba(255, 255, 255, 0.04)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.14)',
          text: '#f3f4f6',
          muted: '#9ca3af',
        },
        // Restrained macOS System Blue
        macblue: {
          DEFAULT: '#007AFF',
          light: '#388BFD',
          dark: '#0058C6',
        },
        // Muted Status Accents
        status: {
          critical: '#DC2626',
          warning: '#EA580C',
          amber: '#D97706',
          success: '#16A34A',
          neutral: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'xs': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        'mac': '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
