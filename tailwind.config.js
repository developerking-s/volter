/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          dark: 'rgb(var(--primary-dark))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
        },
        background: {
          DEFAULT: 'rgb(var(--background))',
        },
        success: {
          DEFAULT: 'rgb(var(--success))',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning))',
        },
        error: {
          DEFAULT: 'rgb(var(--error))',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};