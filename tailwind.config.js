/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          950: '#0B0D14',
          900: '#101426',
          800: '#161B33',
          700: '#1E2444',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#131625',
        },
        canvas: {
          light: '#F5F6FA',
          dark: '#0B0D14',
        },
        brand: {
          50: '#F0EEFF',
          100: '#E1DDFF',
          300: '#B3A9FF',
          400: '#8D7CFF',
          500: '#6F5CFF',
          600: '#5A45F0',
          700: '#4934C7',
        },
        accent: {
          teal: '#14B8A6',
          amber: '#F59E0B',
          rose: '#F43F5E',
          emerald: '#16A34A',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,20,38,0.04), 0 8px 24px -12px rgba(16,20,38,0.10)',
        'card-dark': '0 1px 2px rgba(0,0,0,0.2), 0 8px 24px -12px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        xl2: '1.1rem',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(1.4)' },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        railGrow: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.8s ease-in-out infinite',
        slideIn: 'slideIn 0.25s ease-out',
        railGrow: 'railGrow 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
