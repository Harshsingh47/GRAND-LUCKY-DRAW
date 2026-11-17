/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF0',
          100: '#FAF4D8',
          200: '#F4E5A7',
          300: '#EED372',
          400: '#E4BF3D',
          500: '#D4AF37', // Classic metallic gold
          600: '#B8860B', // Dark golden rod
          700: '#996515',
          800: '#7B4C12',
          900: '#543209',
          950: '#2E1904',
        },
        dark: {
          950: '#070709', // Deepest obsidian black
          900: '#0C0D11', // Card background dark
          850: '#12141A', // Elevated container
          800: '#181B23', // Border / subtle card
          700: '#242936', // Lighter charcoal
          600: '#3A4254',
          500: '#5C657A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        heading: ['Cinzel', 'Cinzel Decorative', 'Georgia', 'serif']
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5E09A 0%, #D4AF37 50%, #996515 100%)',
        'gold-metallic': 'radial-gradient(ellipse at top, #FAF0B8 0%, #D4AF37 45%, #8B6508 100%)',
        'dark-metallic': 'linear-gradient(180deg, #181B23 0%, #0C0D11 100%)',
        'card-glow': 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)'
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
        'gold-glow-lg': '0 0 40px -5px rgba(212, 175, 55, 0.5)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(212, 175, 55, 0.15)'
      }
    },
  },
  plugins: [],
}
