/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro Display"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['"SF Pro Display"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"SF Mono"', 'monospace']
      },
      colors: {
        apple: {
          blue: '#0071e3',
          'blue-dark': '#0077ed',
          'blue-hover': '#0077ed',
          gray: '#f5f5f7',
          'gray-dark': '#1d1d1f',
          'gray-mid': '#6e6e73',
          'gray-light': '#f5f5f7',
          green: '#1d7a40',
          red: '#ff3b30',
          orange: '#ff9500'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'shimmer': 'shimmer 1.5s infinite linear',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } }
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'apple': '0 4px 24px rgba(0,0,0,0.08)',
        'apple-lg': '0 8px 40px rgba(0,0,0,0.12)',
        'apple-xl': '0 20px 60px rgba(0,0,0,0.16)',
        'card': '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'
      }
    }
  },
  plugins: []
};
