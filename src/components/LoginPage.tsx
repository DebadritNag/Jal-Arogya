import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  Link,
} from '@chakra-ui/react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import type { LoginCredentials } from '../types';
import { loginUser } from '../utils/authUtils';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

interface LoginPageProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup }) => {
  const { t } = useLanguage();
  const { mode } = useTheme();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = loginUser(credentials);
    
    if (result.success) {
      onLogin();
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (username: string) => {
    setCredentials({ username, password: 'demo123' });
  };

  return (
    <Box 
      minH="100vh" 
      bg={mode === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'} 
      py={8}
    >
      <Container maxW="md" centerContent>
        <VStack gap={8} w="full">
          {/* Header */}
          <Box textAlign="center">
            <HStack justify="center" mb={4}>
              <Box 
                w="60px" 
                h="60px" 
                rounded="full" 
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="xl"
              >
                <img 
                  src="/logo.svg" 
                  alt="JalArogya Logo" 
                  style={{ 
                    width: '48px', 
                    height: '48px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Heading 
                size="2xl" 
                color="white" 
                fontWeight="800"
                textShadow="2px 2px 4px rgba(0,0,0,0.3)"
              >
                {t('app.title')}
              </Heading>
            </HStack>
            <Text 
              fontSize="lg" 
              color="whiteAlpha.900" 
              textShadow="1px 1px 2px rgba(0,0,0,0.2)"
              mb={4}
            >
              {t('app.subtitle')}
            </Text>
            <HStack justify="center" gap={4}>
              <LanguageToggle position="inline" size="md" />
              <ThemeToggle position="inline" size="md" />
            </HStack>
          </Box>

          {/* Login Card */}
          <Box 
            bg={mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)'} 
            backdropFilter="blur(10px)"
            p={8} 
            rounded="2xl" 
            shadow="2xl"
            w="full"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              bgGradient: mode === 'dark' ? 'linear(to-r, #4a5568, #2d3748)' : 'linear(to-r, #667eea, #764ba2)'
            }}
          >
            <VStack gap={6}>
              <HStack mb={2}>
                <Box 
                  p={3} 
                  rounded="xl" 
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                >
                  <LogIn size={24} />
                </Box>
                <VStack align="start" gap={1}>
                  <Heading size="lg" color={mode === 'dark' ? 'white' : 'gray.800'}>
                    🔐 {t('auth.welcomeBack')}
                  </Heading>
                  <Text fontSize="sm" color={mode === 'dark' ? 'gray.300' : 'gray.600'}>
                    {t('auth.signInDescription')}
                  </Text>
                </VStack>
              </HStack>

              {error && (
                <Box 
                  p={4} 
                  bg="red.50" 
                  border="1px solid" 
                  borderColor="red.200" 
                  rounded="lg" 
                  w="full"
                >
                  <Text color="red.600" fontSize="sm" fontWeight="600">
                    ❌ {error}
                  </Text>
                </Box>
              )}

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack gap={4} w="full">
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="600" color={mode === 'dark' ? 'gray.300' : 'gray.700'} mb={2}>
                      {t('auth.username')}
                    </Text>
                    <Input
                      type="text"
                      value={credentials.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Enter your username"
                      size="lg"
                      bg="white"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'purple.300' }}
                      _focus={{ borderColor: 'purple.500', shadow: 'md' }}
                      required
                    />
                  </Box>

                  <Box w="full">
                    <Text fontSize="sm" fontWeight="600" color={mode === 'dark' ? 'gray.300' : 'gray.700'} mb={2}>
                      {t('auth.password')}
                    </Text>
                    <Box position="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={credentials.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter your password"
                        size="lg"
                        bg="white"
                        border="2px solid"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'purple.300' }}
                        _focus={{ borderColor: 'purple.500', shadow: 'md' }}
                        pr={12}
                        required
                      />
                      <Box
                        position="absolute"
                        right={3}
                        top="50%"
                        transform="translateY(-50%)"
                        cursor="pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        color="gray.500"
                        _hover={{ color: 'gray.700' }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    type="submit"
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    size="lg"
                    w="full"
                    py={6}
                    disabled={isLoading}
                    _hover={{
                      transform: 'translateY(-2px)',
                      shadow: 'xl'
                    }}
                    transition="all 0.2s ease"
                    fontWeight="600"
                  >
                    <LogIn size={20} style={{ marginRight: '8px' }} />
                    {isLoading ? `🔄 ${t('auth.signingIn')}` : t('auth.login')}
                  </Button>
                </VStack>
              </form>

              {/* Demo Accounts */}
              <Box w="full" p={4} bg="blue.50" rounded="xl" border="1px" borderColor="blue.200">
                <Text fontSize="sm" fontWeight="600" color="blue.800" mb={3} textAlign="center">
                  🎯 {t('auth.demoAccess')}
                </Text>
                <VStack gap={2}>
                  <HStack gap={2} w="full">
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      flex={1}
                      onClick={() => handleDemoLogin('citizen_demo')}
                    >
                      {t('auth.citizenDemo')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="green"
                      flex={1}
                      onClick={() => handleDemoLogin('scientist_demo')}
                    >
                      {t('auth.scientistDemo')}
                    </Button>
                  </HStack>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="purple"
                    w="full"
                    onClick={() => handleDemoLogin('policy_demo')}
                  >
                    {t('auth.policymakerDemo')}
                  </Button>
                  <Text fontSize="xs" color="blue.600" textAlign="center">
                    Username: [role]_demo | Password: demo123
                  </Text>
                </VStack>
              </Box>

              {/* Switch to Signup */}
              <Box textAlign="center">
                <Text fontSize="sm" color="gray.600">
                  {t('auth.noAccount')}{' '}
                  <Link 
                    color="purple.600" 
                    fontWeight="600"
                    onClick={onSwitchToSignup}
                    cursor="pointer"
                    _hover={{ color: 'purple.700', textDecoration: 'underline' }}
                  >
                    {t('auth.signup')}
                  </Link>
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;