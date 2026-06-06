/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── Brand palette ────────────────────────────────────────────────────
      colors: {
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },

      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:    ['0.75rem',  { lineHeight: '1.125rem' }],
        sm:    ['0.875rem', { lineHeight: '1.375rem' }],
        base:  ['1rem',     { lineHeight: '1.625rem' }],
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem',  { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem',     { lineHeight: '3.5rem',  letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem',  { lineHeight: '4.25rem', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem',   { lineHeight: '5rem',    letterSpacing: '-0.04em' }],
        '8xl': ['6rem',     { lineHeight: '6.5rem',  letterSpacing: '-0.04em' }],
      },
      fontWeight: {
        thin:       '100',
        extralight: '200',
        light:      '300',
        normal:     '400',
        medium:     '500',
        semibold:   '600',
        bold:       '700',
        extrabold:  '800',
        black:      '900',
      },

      // ─── Spacing & sizing ────────────────────────────────────────────────
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '26':  '6.5rem',
        '30':  '7.5rem',
        '34':  '8.5rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },

      // ─── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        '2xs': '0.125rem',
        xs:    '0.25rem',
        sm:    '0.375rem',
        DEFAULT: '0.5rem',
        md:    '0.625rem',
        lg:    '0.75rem',
        xl:    '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        full:  '9999px',
      },

      // ─── Shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        'xs':          '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'sm':          '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        DEFAULT:       '0 2px 6px -1px rgb(0 0 0 / 0.08), 0 1px 4px -2px rgb(0 0 0 / 0.06)',
        'md':          '0 4px 10px -2px rgb(0 0 0 / 0.09), 0 2px 6px -3px rgb(0 0 0 / 0.06)',
        'lg':          '0 8px 20px -4px rgb(0 0 0 / 0.10), 0 4px 8px -5px rgb(0 0 0 / 0.07)',
        'xl':          '0 16px 32px -6px rgb(0 0 0 / 0.12), 0 8px 16px -8px rgb(0 0 0 / 0.08)',
        '2xl':         '0 24px 48px -10px rgb(0 0 0 / 0.18), 0 12px 24px -14px rgb(0 0 0 / 0.10)',
        // Glow variants
        'glow-brand':  '0 0 20px 2px rgb(16 185 129 / 0.25)',
        'glow-accent': '0 0 20px 2px rgb(245 158 11 / 0.25)',
        'glow-brand-lg': '0 0 40px 6px rgb(16 185 129 / 0.20)',
        // Inset
        'inner-sm':    'inset 0 1px 2px rgb(0 0 0 / 0.06)',
        'inner':       'inset 0 2px 4px rgb(0 0 0 / 0.07)',
        // Card hover
        'card':        '0 2px 8px -2px rgb(0 0 0 / 0.06), 0 0 0 1px rgb(0 0 0 / 0.04)',
        'card-hover':  '0 8px 24px -4px rgb(0 0 0 / 0.10), 0 0 0 1px rgb(0 0 0 / 0.05)',
        'none':        'none',
      },

      // ─── Background images ────────────────────────────────────────────────
      backgroundImage: {
        'gradient-brand':       'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
        'gradient-brand-soft':  'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        'gradient-accent':      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-hero':        'linear-gradient(135deg, #064e3b 0%, #065f46 35%, #0f172a 100%)',
        'gradient-radial':      'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':       'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-brand':           'radial-gradient(at 40% 20%, hsla(160,90%,40%,0.3) 0, transparent 50%), radial-gradient(at 80% 0%,   hsla(189,90%,35%,0.2) 0, transparent 50%), radial-gradient(at 0%  50%,  hsla(155,80%,30%,0.2) 0, transparent 50%)',
        'noise':                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },

      // ─── Transitions ─────────────────────────────────────────────────────
      transitionDuration: {
        '50':   '50ms',
        '150':  '150ms',
        '250':  '250ms',
        '350':  '350ms',
        '450':  '450ms',
        '600':  '600ms',
        '800':  '800ms',
        '1000': '1000ms',
        '1500': '1500ms',
      },
      transitionTimingFunction: {
        'ease-out-expo':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-expo':   'cubic-bezier(0.7, 0, 0.84, 0)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'ease-spring':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-smooth':    'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ─── Keyframes & animations ───────────────────────────────────────────
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-left': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-right': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px 2px rgb(16 185 129 / 0.3)' },
          '50%':      { boxShadow: '0 0 30px 6px rgb(16 185 129 / 0.5)' },
        },
        'shimmer': {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%':      { transform: 'translateY(-8px)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        'slide-in-bottom': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'slide-in-top': {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to:   { transform: 'translateY(0)',     opacity: '1' },
        },
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'orbit': {
          from: { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
        },
      },
      animation: {
        'fade-in':        'fade-in 0.4s ease-out both',
        'fade-up':        'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-down':      'fade-down 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-left':      'fade-left 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-right':     'fade-right 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':       'scale-in 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'float':          'float 4s ease-in-out infinite',
        'float-slow':     'float-slow 6s ease-in-out infinite',
        'pulse-glow':     'pulse-glow 2.5s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'spin-slow':      'spin-slow 8s linear infinite',
        'bounce-gentle':  'bounce-gentle 2s infinite',
        'slide-in-bottom':'slide-in-bottom 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-top':   'slide-in-top 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'orbit':          'orbit 12s linear infinite',
      },

      // ─── Blur ─────────────────────────────────────────────────────────────
      blur: {
        xs: '2px',
        '4xl': '72px',
        '5xl': '96px',
      },

      // ─── Z-index ─────────────────────────────────────────────────────────
      zIndex: {
        '1':   '1',
        '2':   '2',
        '60':  '60',
        '70':  '70',
        '80':  '80',
        '90':  '90',
        '100': '100',
      },

      // ─── Max widths ───────────────────────────────────────────────────────
      maxWidth: {
        '8xl':  '88rem',
        '9xl':  '96rem',
        'prose-sm': '55ch',
        'prose':    '65ch',
        'prose-lg': '75ch',
      },

      // ─── Line heights ─────────────────────────────────────────────────────
      lineHeight: {
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
      },
    },
  },
  plugins: [],
};
