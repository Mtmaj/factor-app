/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  // darkMode: '[data-theme="dark"]',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'meteor-effect': 'meteor 5s linear infinite'
      },
      keyframes: {
        meteor: {
          '0%': {
            transform: 'rotate(215deg) translateX(0)',
            opacity: 1
          },
          '70%': {
            opacity: 1
          },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: 0
          }
        }
      },
      colors: {
        persiangreen: {
          50: '#e5fffc',
          100: '#b3fff5',
          200: '#00E0C6',
          300: '#00CCB4',
          400: '#00BBA2',
          500: '#00A08C',
          600: '#008F7E',
          700: '#007A6C',
          800: '#00665A',
          900: '#005248',
          DEFAULT: '#00A08C'
        },
        crimson: {
          50: '#fde7ee',
          100: '#f9b8cd',
          200: '#f589ac',
          300: '#f15a8a',
          400: '#ed2b69',
          500: '#C01048',
          600: '#a50e3e',
          700: '#760a2c',
          800: '#47061a',
          900: '#180209',
          DEFAULT: '#C01048'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
