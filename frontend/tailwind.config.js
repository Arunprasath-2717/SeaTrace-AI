/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        seatrace: {
          /* Glass surfaces */
          glass:        'rgba(245, 250, 255, 0.68)',
          'glass-light':'rgba(248, 252, 255, 0.50)',
          'glass-strong':'rgba(242, 248, 255, 0.82)',

          /* Accents */
          mint:         '#2DD4BF',   /* teal-400 */
          teal:         '#0D9488',   /* teal-600 */
          deepTeal:     '#0F766E',   /* teal-700 */
          navy:         '#020C1E',
          cyan:         '#22D3EE',
          accent:       '#0891B2',

          /* compat aliases → glass system */
          'teal-dim':   'rgba(13, 148, 136, 0.12)',
          'mint-dim':   'rgba(45, 212, 191, 0.12)',
          'sea-green':  '#2DD4BF',

          /* Text on light & off-white cards */
          text: {
            primary:   '#0f172a',
            secondary: '#1e293b',
            muted:     '#334155',
            dim:       '#475569',
            inverse:   '#f8fafc',
          },

          /* Backgrounds for compatibility */
          bg: {
            primary:   '#f8fafc',
            secondary: '#ffffff',
            surface:   '#ffffff',
            card:      '#ffffff',
            overlay:   'rgba(5, 15, 35, 0.90)',
          },

          /* Borders for compatibility */
          border: {
            subtle:  '#e2e8f0',
            default: '#cbd5e1',
            strong:  '#94a3b8',
          },

          /* Status */
          status: {
            success: '#059669',
            warning: '#D97706',
            danger:  '#DC2626',
            info:    '#0891B2',
            neutral: 'rgba(20, 55, 110, 0.50)',
          },
        },
      },

      fontFamily: {
        sans:  ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono:  ['"JetBrains Mono"', '"ui-monospace"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },

      boxShadow: {
        'glass':     '0 8px 40px rgba(10,40,100,0.12), 0 2px 8px rgba(10,40,100,0.06), inset 0 1.5px 0 rgba(255,255,255,0.85)',
        'glass-sm':  '0 4px 20px rgba(10,40,100,0.09), inset 0 1px 0 rgba(255,255,255,0.65)',
        'glass-lg':  '0 16px 64px rgba(10,40,100,0.16), 0 4px 16px rgba(10,40,100,0.08), inset 0 1.5px 0 rgba(255,255,255,0.85)',
        'glow-teal': '0 0 20px rgba(13,148,136,0.30)',
        'glow-cyan': '0 0 20px rgba(8,145,178,0.30)',
        'panel':     '0 8px 40px rgba(10,40,100,0.12)',
        'card':      '0 4px 20px rgba(10,40,100,0.09)',
      },

      backdropBlur: {
        'glass': '32px',
        'glass-lg': '48px',
      },

      keyframes: {
        'glass-sweep': {
          '0%':   { backgroundPosition: '-100% center' },
          '60%':  { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(0.85)' },
        },
      },

      animation: {
        'float':       'float-gentle 4.5s ease-in-out infinite',
        'pulse-dot':   'pulse-dot 2s ease-in-out infinite',
        'glass-sweep': 'glass-sweep 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
