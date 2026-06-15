/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          darkBg: '#09090b',
          cardBg: 'rgba(24, 24, 27, 0.7)',
          accentPurple: '#a855f7',
          accentCyan: '#06b6d4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.25)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.25)'
      },
      animation: {
        'bounce-slow': 'bounce-slow 4s infinite ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}
