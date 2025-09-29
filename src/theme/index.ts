import { createSystem, defaultConfig } from '@chakra-ui/react';

// Custom theme tokens for dark and light modes
const customTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Custom color palette for JalArogya
        primary: {
          50: { value: '#e6fffa' },
          100: { value: '#b3f5ec' },
          200: { value: '#81e6d9' },
          300: { value: '#4fd1c7' },
          400: { value: '#38b2ac' },
          500: { value: '#319795' },
          600: { value: '#2c7a7b' },
          700: { value: '#285e61' },
          800: { value: '#234e52' },
          900: { value: '#1d4044' },
        },
        secondary: {
          50: { value: '#f0f9ff' },
          100: { value: '#e0f2fe' },
          200: { value: '#bae6fd' },
          300: { value: '#7dd3fc' },
          400: { value: '#38bdf8' },
          500: { value: '#0ea5e9' },
          600: { value: '#0284c7' },
          700: { value: '#0369a1' },
          800: { value: '#075985' },
          900: { value: '#0c4a6e' },
        },
        accent: {
          50: { value: '#fdf4ff' },
          100: { value: '#fae8ff' },
          200: { value: '#f5d0fe' },
          300: { value: '#f0abfc' },
          400: { value: '#e879f9' },
          500: { value: '#d946ef' },
          600: { value: '#c026d3' },
          700: { value: '#a21caf' },
          800: { value: '#86198f' },
          900: { value: '#701a75' },
        },
        // Background colors for light and dark modes
        bg: {
          light: { value: '#ffffff' },
          dark: { value: '#0f172a' },
          'light-secondary': { value: '#f8fafc' },
          'dark-secondary': { value: '#1e293b' },
          'light-tertiary': { value: '#f1f5f9' },
          'dark-tertiary': { value: '#334155' },
          'light-card': { value: '#ffffff' },
          'dark-card': { value: '#1e293b' },
          'light-surface': { value: '#f8fafc' },
          'dark-surface': { value: '#334155' },
        },
        text: {
          light: { value: '#0f172a' },
          dark: { value: '#f8fafc' },
          'light-secondary': { value: '#475569' },
          'dark-secondary': { value: '#cbd5e1' },
          'light-muted': { value: '#64748b' },
          'dark-muted': { value: '#94a3b8' },
          'light-accent': { value: '#334155' },
          'dark-accent': { value: '#e2e8f0' },
        },
        border: {
          light: { value: '#e2e8f0' },
          dark: { value: '#475569' },
          'light-secondary': { value: '#cbd5e1' },
          'dark-secondary': { value: '#64748b' },
          'light-accent': { value: '#94a3b8' },
          'dark-accent': { value: '#334155' },
        },
        // Enhanced gradient colors for dark/light modes
        gradient: {
          'citizen-light': { value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
          'citizen-dark': { value: 'linear-gradient(135deg, #059669 0%, #0891b2 100%)' },
          'scientist-light': { value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
          'scientist-dark': { value: 'linear-gradient(135deg, #0284c7 0%, #0891b2 100%)' },
          'policymaker-light': { value: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' },
          'policymaker-dark': { value: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)' },
          'main-light': { value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          'main-dark': { value: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' },
          'card-light': { value: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' },
          'card-dark': { value: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' },
        }
      },
      // Enhanced spacing tokens
      spacing: {
        xs: { value: '0.5rem' },
        sm: { value: '0.75rem' },
        md: { value: '1rem' },
        lg: { value: '1.5rem' },
        xl: { value: '2rem' },
        '2xl': { value: '3rem' },
        '3xl': { value: '4rem' },
      },
      // Enhanced shadow tokens for dark/light modes
      shadows: {
        'light-sm': { value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
        'light-md': { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
        'light-lg': { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
        'light-xl': { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
        'dark-sm': { value: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)' },
        'dark-md': { value: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)' },
        'dark-lg': { value: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' },
        'dark-xl': { value: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)' },
      }
    },
    semanticTokens: {
      colors: {
        // Semantic colors that adapt to color mode
        bg: {
          DEFAULT: { 
            value: { base: '{colors.bg.light}', _dark: '{colors.bg.dark}' }
          },
          secondary: { 
            value: { base: '{colors.bg.light-secondary}', _dark: '{colors.bg.dark-secondary}' }
          },
          tertiary: { 
            value: { base: '{colors.bg.light-tertiary}', _dark: '{colors.bg.dark-tertiary}' }
          },
          card: { 
            value: { base: '{colors.bg.light-card}', _dark: '{colors.bg.dark-card}' }
          },
          surface: { 
            value: { base: '{colors.bg.light-surface}', _dark: '{colors.bg.dark-surface}' }
          },
        },
        text: {
          DEFAULT: { 
            value: { base: '{colors.text.light}', _dark: '{colors.text.dark}' }
          },
          secondary: { 
            value: { base: '{colors.text.light-secondary}', _dark: '{colors.text.dark-secondary}' }
          },
          muted: { 
            value: { base: '{colors.text.light-muted}', _dark: '{colors.text.dark-muted}' }
          },
          accent: { 
            value: { base: '{colors.text.light-accent}', _dark: '{colors.text.dark-accent}' }
          },
        },
        border: {
          DEFAULT: { 
            value: { base: '{colors.border.light}', _dark: '{colors.border.dark}' }
          },
          secondary: { 
            value: { base: '{colors.border.light-secondary}', _dark: '{colors.border.dark-secondary}' }
          },
          accent: { 
            value: { base: '{colors.border.light-accent}', _dark: '{colors.border.dark-accent}' }
          },
        },
        shadow: {
          sm: { 
            value: { base: '{shadows.light-sm}', _dark: '{shadows.dark-sm}' }
          },
          md: { 
            value: { base: '{shadows.light-md}', _dark: '{shadows.dark-md}' }
          },
          lg: { 
            value: { base: '{shadows.light-lg}', _dark: '{shadows.dark-lg}' }
          },
          xl: { 
            value: { base: '{shadows.light-xl}', _dark: '{shadows.dark-xl}' }
          },
        },
        // Role-specific gradients
        gradient: {
          citizen: { 
            value: { base: '{colors.gradient.citizen-light}', _dark: '{colors.gradient.citizen-dark}' }
          },
          scientist: { 
            value: { base: '{colors.gradient.scientist-light}', _dark: '{colors.gradient.scientist-dark}' }
          },
          policymaker: { 
            value: { base: '{colors.gradient.policymaker-light}', _dark: '{colors.gradient.policymaker-dark}' }
          },
          main: { 
            value: { base: '{colors.gradient.main-light}', _dark: '{colors.gradient.main-dark}' }
          },
          card: { 
            value: { base: '{colors.gradient.card-light}', _dark: '{colors.gradient.card-dark}' }
          },
        }
      }
    }
  }
});

export default customTheme;