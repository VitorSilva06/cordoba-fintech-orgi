/**
 * Design Tokens - Sistema de cores e tipografia unificado
 * Utilizado em toda a aplicação para garantir consistência visual
 */

export const designTokens = {
  // Cores Light Mode
  light: {
    // Backgrounds
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8F9FA',
    bgTertiary: '#F1F3F5',
    bgCard: '#FFFFFF',
    bgInput: '#FFFFFF',
    bgSidebar: '#0C1B33',
    
    // Text
    textPrimary: '#212529',
    textSecondary: '#495057',
    textTertiary: '#6C757D',
    textMuted: '#ADB5BD',
    textOnDark: '#FFFFFF',
    
    // Borders
    borderPrimary: '#DEE2E6',
    borderSecondary: '#E9ECEF',
    borderFocus: '#004BFF',
    
    // Brand Colors
    brandPrimary: '#004BFF',
    brandPrimaryHover: '#0040DB',
    brandSecondary: '#0C1B33',
    brandAccent: '#00C08A',
    brandAccentHover: '#00A378',
    brandWarning: '#FFAA00',
    brandError: '#DC3545',
    brandSuccess: '#00C08A',
    
    // States
    hoverBg: '#F8F9FA',
    activeBg: '#E9ECEF',
    disabledBg: '#E9ECEF',
    disabledText: '#ADB5BD',
    
    // Shadows
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  // Cores Dark Mode
  dark: {
    // Backgrounds
    bgPrimary: '#0A0E1A',
    bgSecondary: '#0F1419',
    bgTertiary: '#151A24',
    bgCard: '#1A1F2E',
    bgInput: '#151A24',
    bgSidebar: '#0C1B33',
    
    // Text
    textPrimary: '#F8F9FA',
    textSecondary: '#DEE2E6',
    textTertiary: '#ADB5BD',
    textMuted: '#6C757D',
    textOnDark: '#F8F9FA',
    
    // Borders
    borderPrimary: '#2D3748',
    borderSecondary: '#252D3D',
    borderFocus: '#4D8FFF',
    
    // Brand Colors
    brandPrimary: '#4D8FFF',
    brandPrimaryHover: '#6BA3FF',
    brandSecondary: '#0C1B33',
    brandAccent: '#00E3A5',
    brandAccentHover: '#00F5B3',
    brandWarning: '#FFB733',
    brandError: '#F56565',
    brandSuccess: '#00E3A5',
    
    // States
    hoverBg: '#1F2937',
    activeBg: '#252D3D',
    disabledBg: '#1F2937',
    disabledText: '#4B5563',
    
    // Shadows
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  
  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export type DesignTokens = typeof designTokens;
