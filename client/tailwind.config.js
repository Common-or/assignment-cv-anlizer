/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.55' } },
        gauge: { from: { strokeDashoffset: 'var(--gauge-from)' }, to: { strokeDashoffset: 'var(--gauge-to)' } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        fadeUp: 'fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        pulseSoft: 'pulseSoft 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
