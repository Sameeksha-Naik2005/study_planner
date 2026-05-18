/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#101828',
        mist: '#F8FAFC',
        brand: {
          50: '#EFF6FF',
          500: '#2563EB',
          600: '#1D4ED8'
        },
        coral: '#F9735B',
        mint: '#20C997',
        amber: '#F59E0B'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(37, 99, 235, 0.22)',
        glass: '0 20px 70px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
