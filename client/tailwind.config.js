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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Manrope', 'sans-serif'],
        serif: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B58416 0%, #D6A63A 50%, #996515 100%)',
        'gold-metallic': 'radial-gradient(ellipse at top, #FDF7DF 0%, #D6A63A 50%, #A67614 100%)',
        'card-glow': 'radial-gradient(circle at 50% 0%, rgba(214, 166, 58, 0.08) 0%, transparent 70%)',
        'hero-glow': 'radial-gradient(circle at 50% 30%, rgba(214, 166, 58, 0.12) 0%, rgba(248, 249, 252, 0) 70%)',
      },
      boxShadow: {
        'card-light': '0 2px 10px -2px rgba(23, 32, 51, 0.05), 0 4px 16px -2px rgba(23, 32, 51, 0.03)',
        'card-hover': '0 12px 28px -4px rgba(23, 32, 51, 0.08), 0 4px 12px -2px rgba(214, 166, 58, 0.12)',
        'gold-glow': '0 4px 20px -2px rgba(214, 166, 58, 0.35)',
        'gold-glow-lg': '0 8px 30px -4px rgba(214, 166, 58, 0.45)',
        'card-dark': '0 2px 10px -2px rgba(23, 32, 51, 0.05), 0 4px 16px -2px rgba(23, 32, 51, 0.03)',
      }
    },
  },
  plugins: [],
}
