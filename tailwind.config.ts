import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070d',
        accent: '#6d5efc',
        cyan: '#67e8f9',
        text: '#eff6ff',
        muted: '#94a3b8'
      },
      fontFamily: {
        display: ['Inter','system-ui','sans-serif'],
        body: ['Inter','system-ui','sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config;
