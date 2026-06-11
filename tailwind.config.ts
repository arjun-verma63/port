import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0A0B',
        'bg-surface': '#111113',
        'bg-elevated': '#1A1A1E',
        'accent-metal': '#C8A96E',
        'accent-cold': '#4A90D9',
        'accent-glow': '#7B5EA7',
        'text-primary': '#F0EDE8',
        'text-secondary': '#7A7874',
      },
      borderColor: {
        'subtle': 'rgba(255,255,255,0.06)',
        'active': 'rgba(200,169,110,0.4)',
      },
      fontFamily: {
        display: ['var(--font-neue-machina)', 'Clash Display', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['80px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'section': ['48px', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      backdropBlur: {
        'nav': '12px',
      },
      animation: {
        'skill-fill': 'skillFill 1s ease-out forwards',
      },
      keyframes: {
        skillFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--skill-level)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
