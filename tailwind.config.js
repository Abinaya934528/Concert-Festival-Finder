/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vybe: {
          dark: '#07080C',
          card: '#0F121C',
          surface: '#151926',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(204, 255, 0, 0.3)',
          violet: {
            DEFAULT: '#9D4EDD',
            glow: '#B388FF',
            dark: '#5A189A',
            deep: '#240046',
          },
          lime: {
            DEFAULT: '#CCFF00',
            hover: '#B8E600',
            glow: '#E2FF66',
            muted: '#84A900',
          },
          cyan: '#00F5D4',
          fuchsia: '#FF007F',
          amber: '#FFB703',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Syne"', '"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(157, 78, 221, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(204, 255, 0, 0.1) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(0, 245, 212, 0.08) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-violet': '0 0 35px -5px rgba(157, 78, 221, 0.35)',
        'glow-lime': '0 0 30px -5px rgba(204, 255, 0, 0.35)',
        'glow-cyan': '0 0 30px -5px rgba(0, 245, 212, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
