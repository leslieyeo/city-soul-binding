/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'void': '#0A0A0A',
        'charcoal': '#141414',
        'ash': '#1A1A1A',
        'smoke': '#2A2A2A',
        'fog': '#4A4A4A',
        'silver': '#6A6A6A',
        'pearl': '#848484',
        'paper': '#FFFFFF',
        'gold': '#C9A962',
        'jade': '#4A8B6E',
        'ember': '#D4553A',
        'stream': '#5B8FCE'
      },
      fontFamily: {
        title: ['"Cormorant Garamond"', '"Noto Serif SC"', 'serif'],
        sans: ['"Inter"', '"Noto Sans SC"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace']
      },
      animation: {
        runeSpin: 'runeSpin 2.8s linear infinite',
        shine: 'shine 2.2s ease-in-out infinite',
        rise: 'rise 0.8s ease forwards'
      },
      keyframes: {
        runeSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        shine: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.4)' }
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
