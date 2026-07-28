import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // IMW Run brand colors
        brand: {
          primary: '#1E40AF', // Deep blue — faith & strength
          secondary: '#F59E0B', // Amber — energy & warmth
          accent: '#10B981', // Emerald — nature & growth
          dark: '#111827', // Near-black
          light: '#F9FAFB', // Near-white
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      // Minimum touch target: 44×44px (WCAG 2.1 AA)
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      screens: {
        // Bottom nav breakpoint (< 768px shows bottom nav)
        'nav-bottom': { max: '767px' },
        'nav-top': '768px',
      },
    },
  },
  plugins: [],
};

export default config;
