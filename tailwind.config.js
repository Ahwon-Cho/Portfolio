/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ART: sage ramp — hue-shifted to the green-grey the walk scene already
           paints (#f1f3f1 / #eef0ee / #d9dcd9), matched to the tone of the
           soundtrack (plucked strings + vibraphone) and the sunny-afternoon
           video. Each step holds the lightness of the ramp it replaces, so
           existing contrast ratios are unchanged. */
        ink: {
          50:  '#F3F6F2',
          100: '#E7EBE5',
          200: '#D2D8CF',
          300: '#ADB6AA',
          400: '#868F83',
          500: '#656E63',
          600: '#4C554A',
          700: '#383F36',
          800: '#262B25',
          900: '#171B16',
          950: '#0B0D0B',
        },
        /* stone + zinc are overridden (not extended) so the ~340 existing
           stone-* / zinc-* classes inherit the shift without edits. */
        stone: {
          50:  '#FAFBF9',
          100: '#F3F6F2',
          200: '#E4E9E3',
          300: '#D1D8CF',
          400: '#A2ABA0',
          500: '#71796F',
          600: '#4F5A4D',
          700: '#3D473B',
          800: '#242B23',
          900: '#181D17',
          950: '#0A0D0A',
        },
        zinc: {
          50:  '#F9FBF9',
          100: '#F1F5F1',
          200: '#E1E7E1',
          300: '#D0D7CF',
          400: '#9CA69B',
          500: '#6C766B',
          600: '#4E584D',
          700: '#3B443A',
          800: '#232922',
          900: '#161A15',
          950: '#080A08',
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.7s ease-out forwards',
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'bar-bounce': 'barBounce 0.65s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        barBounce: {
          '0%':   { height: '3px'  },
          '100%': { height: '14px' },
        },
      },
    },
  },
  plugins: [],
}
