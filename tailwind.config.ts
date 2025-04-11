import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        spartan: ['League Spartan', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        comfortaa: ['Comfortaa', 'cursive'],
        jost: ['Jost', 'sans-serif'],
        questrial: ['Questrial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        background: '#f1f3f5',
        foreground: '#c43c1e',
        primary: {
          DEFAULT: '#c43c1e', // Red from the palette
        },
        secondary: {
          DEFAULT: '#ef8535', // Main orange from palette (for landing page)
        },
        accent: {
          DEFAULT: '#ffcb65', // Soft yellow accent
        },
        brown: {
          DEFAULT: '#763c00',
        },
        orange: {
          DEFAULT: '#CD6301',
        },
        cream: {
          DEFAULT: '#f9f7dc',
        },
        lightorange: {
          DEFAULT: '#F8DCBF',
        },
        gray: {
          DEFAULT: '#BCB7AF',
        },
        white: {
          DEFAULT: '#ffffff',
        },
        // Adding new colors from the palette
        lightgray: {
          DEFAULT: '#f1f3f5', // Light gray background
        },
        palegray: {
          DEFAULT: '#BCB7AF', // Pale gray from palette
        },
        paleyellow: {
          DEFAULT: '#f9f7dc', // Pale yellow from palette
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
export default config;
