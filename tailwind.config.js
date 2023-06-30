/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'site-gray': {
          500: 'rgb(214, 219, 220)',
          600: 'rgb(195, 200, 201)',
          700: 'rgb(172, 175, 176)'
        }
      },
      fontFamily: {
        sans: ['var(--font-rubik)'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
