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
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { Eye, EyeOff, UserPlus, User, Microscope, Building2 } from 'lucide-react';
import type { SignupData, UserRole } from '../types';
import { registerUser } from '../utils/authUtils';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

interface SignupPageProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin }) => {
  const { t } = useLanguage();
  const { mode } = useTheme();
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
    securityKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SignupData, value: string | UserRole) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate security key for scientist and policymaker roles
    if (formData.role === 'scientist' && formData.securityKey !== 'ind012') {
      setError('Invalid security key for Scientist role. Please contact administrator.');
      setIsLoading(false);
      return;
    }
    
    if (formData.role === 'policymaker' && formData.securityKey !== 'bh77') {
      setError('Invalid security key for Policymaker role. Please contact administrator.');
      setIsLoading(false);
      return;
    }

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = registerUser(formData);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        onSignup();
      }, 1500);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const roleConfig = {
    citizen: {
      label: 'Citizen',
      icon: User,
      color: 'blue',
      description: 'Test water quality & find nearby data',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    scientist: {
      label: 'Scientist/Admin',
      icon: Microscope,
      color: 'green',
      description: 'Upload data, analyze results & generate reports (Security key required)',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    policymaker: {
      label: 'Policymaker',
      icon: Building2,
      color: 'purple',
      description: 'Regional analysis, trends & policy tools (Security key required)',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg={mode === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'} 
      py={8}
    >
      <Container maxW="2xl" centerContent>
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

          {/* Signup Card */}
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
                  <UserPlus size={24} />
                </Box>
                <VStack align="start" gap={1}>
                  <Heading size="lg" color={mode === 'dark' ? 'white' : 'gray.800'}>
                    👤 Create Account
                  </Heading>
                  <Text fontSize="sm" color={mode === 'dark' ? 'gray.300' : 'gray.600'}>
                    Join the water quality monitoring network
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

              {success && (
                <Box 
                  p={4} 
                  bg="green.50" 
                  border="1px solid" 
                  borderColor="green.200" 
                  rounded="lg" 
                  w="full"
                >
                  <Text color="green.600" fontSize="sm" fontWeight="600">
                    ✅ {success}
                  </Text>
                </Box>
              )}

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack gap={6} w="full">
                  {/* Role Selection */}
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={3}>
                      Select Your Role
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                      {Object.entries(roleConfig).map(([role, config]) => {
                        const IconComponent = config.icon;
                        const isSelected = formData.role === role;
                        
                        return (
                          <Box
                            key={role}
                            p={4}
                            border="2px solid"
                            borderColor={isSelected ? "purple.400" : "gray.200"}
                            rounded="xl"
                            cursor="pointer"
                            onClick={() => handleInputChange('role', role as UserRole)}
                            bg={isSelected ? "purple.50" : "white"}
                            _hover={{
                              borderColor: "purple.300",
                              bg: "purple.25",
                              transform: "translateY(-2px)",
                              shadow: "md"
                            }}
                            transition="all 0.2s ease"
                            textAlign="center"
                          >
                            <VStack gap={2}>
                              <Box 
                                p={2} 
                                rounded="lg" 
                                bg={isSelected ? config.gradient : "gray.100"}
                                color={isSelected ? "white" : "gray.600"}
                              >
                                <IconComponent size={20} />
                              </Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                                {config.label}
                              </Text>
                              <Text fontSize="xs" color="gray.600" textAlign="center">
                                {config.description}
                              </Text>
                              {isSelected && (
                                <Badge colorScheme="purple" variant="solid" size="sm">
                                  Selected
                                </Badge>
                              )}
                            </VStack>
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  </Box>

                  {/* Security Key - Only for Scientist and Policymaker */}
                  {(formData.role === 'scientist' || formData.role === 'policymaker') && (
                    <Box w="full">
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                        Security Key
                      </Text>
                      <Input
                        type="text"
                        value={formData.securityKey || ''}
                        onChange={(e) => handleInputChange('securityKey', e.target.value)}
                        placeholder={`Enter security key for ${roleConfig[formData.role].label}`}
                        size="lg"
                        bg="white"
                        border="2px solid"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'purple.300' }}
                        _focus={{ borderColor: 'purple.500', shadow: 'md' }}
                        required
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {formData.role === 'scientist' 
                          ? 'Required for scientist/admin access. Contact administrator if you don\'t have the key.'
                          : 'Required for policymaker access. Contact administrator if you don\'t have the key.'
                        }
                      </Text>
                      <Box mt={2} p={3} bg="yellow.50" border="1px" borderColor="yellow.200" rounded="md">
                        <Text fontSize="xs" color="yellow.700" fontWeight="600">
                          🔐 Security Notice: This role requires administrative approval and a valid security key.
                        </Text>
                      </Box>
                    </Box>
                  )}

                  {/* Username */}
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      Username
                    </Text>
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Enter a unique username"
                      size="lg"
                      bg="white"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'purple.300' }}
                      _focus={{ borderColor: 'purple.500', shadow: 'md' }}
                      required
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Must be at least 3 characters long
                    </Text>
                  </Box>

                  {/* Password */}
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      Password
                    </Text>
                    <Box position="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter a secure password"
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
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Must be at least 6 characters long
                    </Text>
                  </Box>

                  {/* Confirm Password */}
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                      Confirm Password
                    </Text>
                    <Box position="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        color="gray.500"
                        _hover={{ color: 'gray.700' }}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                    <UserPlus size={20} style={{ marginRight: '8px' }} />
                    {isLoading ? '🔄 Creating Account...' : 'Create Account'}
                  </Button>
                </VStack>
              </form>

              {/* Switch to Login */}
              <Box textAlign="center">
                <Text fontSize="sm" color="gray.600">
                  Already have an account?{' '}
                  <Link 
                    color="purple.600" 
                    fontWeight="600"
                    onClick={onSwitchToLogin}
                    cursor="pointer"
                    _hover={{ color: 'purple.700', textDecoration: 'underline' }}
                  >
                    Sign In
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

export default SignupPage;