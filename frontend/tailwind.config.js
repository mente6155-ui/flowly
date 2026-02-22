/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      colors: {
        flowly: {
          bg: '#000000',
          surface: '#0a0a0a',
          card: '#111111',
          border: '#1a1a1a',
          muted: '#6e6e73',
          accent: '#007aff',
          accentHover: '#0051d5',
          violet: '#5856d6',
          emerald: '#30d158',
          rose: '#ff3b30',
        },
      },
      boxShadow: {
        'apple': '0 2px 12px rgba(0, 0, 0, 0.2), 0 0 0 0.5px rgba(255, 255, 255, 0.08)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.1)',
        'apple-xl': '0 16px 64px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.12)',
        'glow': '0 0 40px -10px rgba(0, 122, 255, 0.4)',
        'glow-sm': '0 0 20px -5px rgba(0, 122, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
