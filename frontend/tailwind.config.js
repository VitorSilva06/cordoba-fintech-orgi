/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        // Semantic colors using CSS variables
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        
        card: {
          DEFAULT: 'var(--bg-card)',
          foreground: 'var(--text-primary)'
        },
        popover: {
          DEFAULT: 'var(--bg-card)',
          foreground: 'var(--text-primary)'
        },
        primary: {
          DEFAULT: 'var(--brand-primary)',
          hover: 'var(--brand-primary-hover)',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: 'var(--bg-secondary)',
          foreground: 'var(--text-primary)'
        },
        muted: {
          DEFAULT: 'var(--bg-tertiary)',
          foreground: 'var(--text-tertiary)'
        },
        accent: {
          DEFAULT: 'var(--brand-accent)',
          hover: 'var(--brand-accent-hover)',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: 'var(--brand-error)',
          foreground: '#FFFFFF'
        },
        success: {
          DEFAULT: 'var(--brand-success)',
          foreground: '#FFFFFF'
        },
        warning: {
          DEFAULT: 'var(--brand-warning)',
          foreground: '#000000'
        },
        border: 'var(--border-primary)',
        input: 'var(--border-primary)',
        ring: 'var(--brand-primary)',
        
        // Text colors
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-muted)',
        
        // Chart colors
        chart: {
          '1': 'var(--chart-primary)',
          '2': 'var(--chart-success)',
          '3': 'var(--chart-warning)',
          '4': 'var(--chart-danger)',
          '5': 'var(--chart-info)'
        },
        
        // Sidebar
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
          muted: 'var(--sidebar-muted)'
        },
        
        // Header
        header: {
          DEFAULT: 'var(--bg-header)',
        }
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      transitionDuration: {
        'theme': '200ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
}
