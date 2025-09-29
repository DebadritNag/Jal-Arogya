import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Container, Heading, Flex, Badge, VStack, HStack, Button, Text } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { User } from './types';
import ScientistDashboard from './pages/ScientistDashboard.tsx';
import CitizenInterface from './pages/CitizenInterface.tsx';
import PolicymakerInterface from './pages/PolicymakerInterface.tsx';
import LoginPage from './components/LoginPage.tsx';
import SignupPage from './components/SignupPage.tsx';
import LanguageToggle from './components/LanguageToggle.tsx';
import ThemeToggle from './components/ThemeToggle.tsx';
import { User as UserIcon, Microscope, Building2, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser, createDemoUsers } from './utils/authUtils';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useLanguage } from './hooks/useLanguage';
import { useTheme } from './hooks/useTheme';
import customTheme from './theme';

const queryClient = new QueryClient();

function AppContent() {
  const { t } = useLanguage();
  const { mode } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create demo users on app start
    createDemoUsers();
    
    // Check for existing authentication
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
  };

  const handleSignup = () => {
    // After successful signup, switch to login
    setAuthView('login');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Box 
        minH="100vh" 
        bg={mode === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <VStack gap={4}>
          <Text color="white" fontSize="xl" fontWeight="600">
            🔄 {t('app.loading')}
          </Text>
          <LanguageToggle position="inline" size="sm" />
          <ThemeToggle position="inline" size="sm" />
        </VStack>
      </Box>
    );
  }

  // Show authentication pages if not logged in
  if (!currentUser) {
    return (
      authView === 'login' ? (
        <LoginPage 
          onLogin={handleLogin} 
          onSwitchToSignup={() => setAuthView('signup')} 
        />
      ) : (
        <SignupPage 
          onSignup={handleSignup} 
          onSwitchToLogin={() => setAuthView('login')} 
        />
      )
    );
  }

  const roleConfig = {
    citizen: {
      label: t('roles.citizen'),
      icon: UserIcon,
      color: 'blue',
      description: t('roles.citizenDesc')
    },
    scientist: {
      label: t('roles.scientist'),
      icon: Microscope,
      color: 'green',
      description: t('roles.scientistDesc')
    },
    policymaker: {
      label: t('roles.policymaker'),
      icon: Building2,
      color: 'purple',
      description: t('roles.policymakerDesc')
    }
  };

  const renderContent = () => {
    switch (currentUser.role) {
      case 'scientist':
        return <ScientistDashboard />;
      case 'policymaker':
        return <PolicymakerInterface />;
      default:
        return <CitizenInterface />;
    }
  };

  // Main authenticated app
  return (
    <Box 
      minH="100vh" 
      bg={mode === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}
    >
      {/* Enhanced Header */}
      <Box 
        bg={mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)'} 
        backdropFilter="blur(10px)"
        boxShadow={mode === 'dark' ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)' : 'xl'} 
        py={6}
        position="sticky"
        top={0}
        zIndex={10}
        borderBottom={mode === 'dark' ? '1px solid' : 'none'}
        borderColor={mode === 'dark' ? 'rgba(71, 85, 105, 0.3)' : 'transparent'}
      >
        <Container maxW="7xl">
          <Flex align="center" justify="space-between">
            <HStack gap={3}>
              <Box 
                w="50px" 
                h="50px" 
                rounded="full" 
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="md"
              >
                <img 
                  src="/logo.svg" 
                  alt="JalArogya Logo" 
                  style={{ 
                    width: '38px', 
                    height: '38px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <VStack align="start" gap={0}>
                <Heading size="xl" color={mode === 'dark' ? 'white' : 'gray.800'} fontWeight="800">
                  {t('app.title')}
                </Heading>
                <Text fontSize="sm" color={mode === 'dark' ? 'gray.300' : 'gray.600'} fontWeight="600">
                  {t('app.subtitle')}
                </Text>
              </VStack>
            </HStack>
            
            <HStack gap={4}>
              {/* Theme Toggle */}
              <ThemeToggle position="header" size="sm" />
              
              {/* Language Toggle */}
              <LanguageToggle position="header" size="sm" />
              
              {/* User Info */}
              <VStack align="end" gap={0}>
                <Text fontSize="sm" fontWeight="600" color={mode === 'dark' ? 'white' : 'gray.800'}>
                  {t('common.welcome')}, {currentUser.username}
                </Text>
                <Badge 
                  bg={roleConfig[currentUser.role].color === 'blue' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
                       roleConfig[currentUser.role].color === 'green' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                       'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'}
                  color="white"
                  px={3} 
                  py={1} 
                  rounded="full"
                  fontSize="xs"
                  fontWeight="600"
                >
                  {roleConfig[currentUser.role].label}
                </Badge>
              </VStack>
              
              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                colorScheme="red"
                _hover={{
                  bg: 'red.50',
                  transform: 'translateY(-1px)'
                }}
                transition="all 0.2s ease"
              >
                <LogOut size={16} style={{ marginRight: '4px' }} />
                {t('auth.logout')}
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Content */}
      <Container maxW="7xl" py={8}>
        {renderContent()}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider value={customTheme}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
