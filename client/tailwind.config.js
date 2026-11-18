/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8F9FC',
          card: '#FFFFFF',
          gold: '#D6A63A',
          goldLight: '#F3E5C1',
          goldDark: '#B8860B',
          navy: '#172033',
          slate: '#667085',
          border: '#E8EAF0',
          success: '#18865B',
        },
        gold: {
          50: '#FAF7EE',
          100: '#F5ECCF',
          200: '#F3E5C1',
          300: '#E6CD87',
          400: '#DFB956',
          500: '#D6A63A', // Champagne / refined gold
          600: '#B8860B',
          700: '#946708',
          800: '#734E07',
          900: '#4D3305',
          950: '#2E1904',
        },
        dark: {
          950: '#172033', // Deep navy
          900: '#1E293B',
          850: '#26334D',
          800: '#334155',
          700: '#475569',
          600: '#64748B',
          500: '#667085',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        display: ['Cinzel', 'serif'],
        serif: ['Cinzel', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B58416 0%, #E5BA48 30%, #D4AF37 50%, #996515 100%)',
        'gold-metallic': 'radial-gradient(ellipse at top, #FFF7D6 0%, #D4AF37 50%, #9E7012 100%)',
        'gold-shine': 'linear-gradient(135deg, #F9D678 0%, #E2B445 40%, #C4901C 100%)',
        'pearl-card': 'linear-gradient(145deg, #FFFFFF 0%, #FDFBF7 100%)',
        'card-glow': 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
        'hero-glow': 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.18) 0%, rgba(250, 248, 245, 0) 70%)',
      },
      boxShadow: {
        'card-light': '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 10px 30px -5px rgba(212, 175, 55, 0.06)',
        'card-hover': '0 16px 36px -6px rgba(15, 23, 42, 0.08), 0 6px 20px -2px rgba(212, 175, 55, 0.2)',
        'gold-glow': '0 4px 20px -2px rgba(212, 175, 55, 0.4)',
        'gold-glow-lg': '0 10px 35px -3px rgba(212, 175, 55, 0.5)',
        'card-dark': '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 10px 30px -5px rgba(212, 175, 55, 0.06)',
      }
    },
  },
  plugins: [],
}
