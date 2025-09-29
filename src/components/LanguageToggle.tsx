import React from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import type { Language } from '../contexts/languageTypes';

interface LanguageToggleProps {
  position?: 'header' | 'inline';
  size?: 'sm' | 'md' | 'lg';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  position = 'header', 
  size = 'sm' 
}) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const getLanguageLabel = (lang: Language) => {
    return lang === 'en' ? 'English' : 'हिंदी';
  };

  if (position === 'inline') {
    return (
      <HStack gap={2}>
        <Globe size={16} />
        <Button
          size={size}
          variant="outline"
          onClick={toggleLanguage}
          minW="80px"
          fontWeight="600"
        >
          {getLanguageLabel(language)}
        </Button>
      </HStack>
    );
  }

  return (
    <Box>
      <HStack gap={2}>
        <Globe size={16} />
        <Text fontSize="xs" color="gray.600">
          Language:
        </Text>
        <Button
          size={size}
          variant="ghost"
          onClick={toggleLanguage}
          minW="60px"
          fontWeight="600"
          px={2}
          _hover={{
            bg: 'whiteAlpha.200'
          }}
        >
          {getLanguageLabel(language)}
        </Button>
      </HStack>
    </Box>
  );
};

export default LanguageToggle;