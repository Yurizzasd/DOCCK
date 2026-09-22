/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070708',
          900: '#0c0c0f',
          850: '#101014',
          800: '#141419',
          700: '#1c1c22',
          600: '#26262e'
        },
        brand: {
          300: '#ffd666',
          400: '#ffbe1a',
          500: '#f5a301',
          600: '#d97f06'
        },
        ember: {
          400: '#ff7a1a',
          500: '#f04b1d',
          600: '#d21f26'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 8px 30px -12px rgba(0,0,0,.7)',
        glow: '0 0 24px -6px rgba(255,190,26,.45)',
        'glow-red': '0 0 24px -8px rgba(210,31,38,.55)'
      },
      borderRadius: {
        xl2: '14px'
      }
    }
  },
  plugins: []
};
