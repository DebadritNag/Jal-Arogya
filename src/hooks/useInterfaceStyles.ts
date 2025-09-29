import { useTheme } from './useTheme';

export const useInterfaceStyles = (interfaceType: 'citizen' | 'scientist' | 'policymaker') => {
  const { mode } = useTheme();
  
  const styles = {
    // Background gradients for each interface
    backgroundGradient: {
      citizen: mode === 'dark' 
        ? 'linear-gradient(135deg, #059669 0%, #0891b2 100%)'
        : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      scientist: mode === 'dark'
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      policymaker: mode === 'dark'
        ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    
    // Card backgrounds
    cardBackground: mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'white',
    
    // Header backgrounds
    headerBackground: mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    
    // Text colors
    primaryText: mode === 'dark' ? 'white' : 'gray.800',
    secondaryText: mode === 'dark' ? 'gray.300' : 'gray.600',
    mutedText: mode === 'dark' ? 'gray.400' : 'gray.500',
    
    // Border colors
    borderColor: mode === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'transparent',
    
    // Shadow styles
    shadow: mode === 'dark' ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)' : '2xl',
    
    // Gradient for cards
    cardGradient: {
      citizen: mode === 'dark' 
        ? 'linear(to-r, #059669, #0891b2)'
        : 'linear(to-r, #43e97b, #38f9d7)',
      scientist: mode === 'dark'
        ? 'linear(to-r, #0284c7, #0891b2)'
        : 'linear(to-r, #4facfe, #00f2fe)',
      policymaker: mode === 'dark'
        ? 'linear(to-r, #7c3aed, #8b5cf6)'
        : 'linear(to-r, #667eea, #764ba2)'
    }
  };
  
  return {
    ...styles,
    currentGradient: styles.backgroundGradient[interfaceType],
    currentCardGradient: styles.cardGradient[interfaceType],
    isDark: mode === 'dark'
  };
};