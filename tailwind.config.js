export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E44217',
          hover: '#C93815',
          50: '#FEF2EE',
          100: '#FDE4DD',
          200: '#FBC7BA',
          300: '#F8A898',
          400: '#F58975',
          500: '#F16B53',
          600: '#E44217',
          700: '#C93815',
          800: '#AD2F12',
          900: '#92280F',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'dots-light': 'radial-gradient(circle, #E44217 1px, transparent 1px)',
        'dots-dark': 'radial-gradient(circle, rgba(228, 66, 23, 0.3) 1px, transparent 1px)',
        'diagonal-light': 'linear-gradient(45deg, #E44217 12%, transparent 0, transparent 88%, #E44217 0)',
        'diagonal-dark': 'linear-gradient(45deg, rgba(228, 66, 23, 0.3) 12%, transparent 0, transparent 88%, rgba(228, 66, 23, 0.3) 0)',
        'cross-light': 'linear-gradient(#E44217 1px, transparent 1px), linear-gradient(to right, #E44217 1px, transparent 1px)',
        'cross-dark': 'linear-gradient(rgba(228, 66, 23, 0.3) 1px, transparent 1px), linear-gradient(to right, rgba(228, 66, 23, 0.3) 1px, transparent 1px)',
        'zigzag-light': 'linear-gradient(-45deg, #E44217 12%, transparent 0), linear-gradient(45deg, #E44217 12%, transparent 0)',
        'zigzag-dark': 'linear-gradient(-45deg, rgba(228, 66, 23, 0.3) 12%, transparent 0), linear-gradient(45deg, rgba(228, 66, 23, 0.3) 12%, transparent 0)',
      },
      backgroundSize: {
        'pattern-sm': '16px 16px',
        'pattern-md': '24px 24px',
        'pattern-lg': '32px 32px',
      },
    },
  },
  plugins: [],
}