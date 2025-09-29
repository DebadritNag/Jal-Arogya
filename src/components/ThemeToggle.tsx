import React from 'react';
import { Button, HStack, Text } from '@chakra-ui/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';

interface ThemeToggleProps {
  position?: 'header' | 'inline';
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  position = 'header', 
  size = 'sm' 
}) => {
  const { mode, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const isDark = mode === 'dark';

  if (position === 'inline') {
    return (
      <HStack gap={2}>
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
        <Button
          size={size}
          variant="outline"
          onClick={toggleTheme}
          minW="80px"
          fontWeight="600"
          _dark={{
            borderColor: 'whiteAlpha.300',
            color: 'white',
            _hover: {
              bg: 'whiteAlpha.200'
            }
          }}
        >
          {isDark ? t('common.dark') : t('common.light')}
        </Button>
      </HStack>
    );
  }

  return (
    <HStack gap={2}>
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
      <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.300' }}>
        {t('common.theme')}:
      </Text>
      <Button
        size={size}
        variant="ghost"
        onClick={toggleTheme}
        minW="60px"
        fontWeight="600"
        px={2}
        _hover={{
          bg: 'whiteAlpha.200'
        }}
        _dark={{
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.200'
          }
        }}
      >
        {isDark ? t('common.dark') : t('common.light')}
      </Button>
    </HStack>
  );
};

export default ThemeToggle;