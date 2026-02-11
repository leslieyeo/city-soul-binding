/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0B1021',
        nebula: '#172142',
        ink: '#09101E',
        paper: '#F4EFE2',
        mist: '#B8C2D9',
        ember: '#FF7345',
        jade: '#57B27D',
        amber: '#F5A524',
        steel: '#8CA0B8',
        tide: '#4F8CCF'
      },
      boxShadow: {
        card: '0 24px 48px rgba(2, 12, 40, 0.34)'
      },
      backgroundImage: {
        grain:
          "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.04\"%3E%3Ccircle cx=\"14\" cy=\"32\" r=\"1.2\"/%3E%3Ccircle cx=\"80\" cy=\"44\" r=\"1\"/%3E%3Ccircle cx=\"112\" cy=\"18\" r=\"1\"/%3E%3Ccircle cx=\"166\" cy=\"76\" r=\"1.4\"/%3E%3Ccircle cx=\"188\" cy=\"146\" r=\"1\"/%3E%3Ccircle cx=\"24\" cy=\"158\" r=\"1\"/%3E%3Ccircle cx=\"76\" cy=\"182\" r=\"1.2\"/%3E%3Ccircle cx=\"146\" cy=\"164\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')"
      },
      fontFamily: {
        title: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        body: ['"Noto Sans SC"', '"Source Han Sans SC"', 'sans-serif'],
        script: ['"Ma Shan Zheng"', 'cursive']
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseLine: 'pulseLine 2s ease-in-out infinite',
        drift: 'drift 12s linear infinite',
        runeSpin: 'runeSpin 2.8s linear infinite',
        shine: 'shine 2.2s ease-in-out infinite',
        rise: 'rise 0.8s ease forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseLine: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.9' }
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-200px)' }
        },
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
