/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: '#006e2f',
          container: '#22c55e',
        },
        secondary: {
          DEFAULT: '#0058be',
          container: '#2170e4',
        },
        tertiary: {
          DEFAULT: '#9e4036',
          container: '#ff8b7c',
        },
        surface: {
          DEFAULT: '#f3fcef',
          dim: '#d4ddd0',
          bright: '#f3fcef',
          container: {
            lowest: '#ffffff',
            low: '#edf6ea',
            DEFAULT: '#e8f0e4',
            high: '#e2ebde',
            highest: '#dce5d9',
          }
        },
        role: {
          farmer: '#16a34a',
          buyer: '#3b82f6',
          transporter: '#f97316',
          admin: '#8b5cf6',
        },
        dark: {
          100: '#1e1e2d',
          200: '#151521',
          300: '#0f0f1a',
          400: '#0a0a14',
        }
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        '4xl': '4rem',
      },
      spacing: {
        'unit': '4px',
        'tiny': '4px',
        'small': '8px',
        'medium': '12px',
        'standard': '16px',
        'large': '20px',
        'section': '24px',
        'margin': '32px',
        'major': '40px',
        'hero': '48px',
      }
    }
  },
  plugins: [],
}
