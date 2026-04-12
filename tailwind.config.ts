import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cpnt: {
          brown: '#2B1408',
          'brown-mid': '#3D1E0A',
          'brown-light': '#5C3317',
          'brown-card': '#4A2510',
          cream: '#FDF8ED',
          green: '#3E6145',
          orange: '#C65C33',
        },
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
