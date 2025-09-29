/**
 * AI-Powered Help Assistant Component
 * 
 * A lightweight, responsive chatbox widget that provides automated responses
 * based on keyword detection. Designed to be integrated into any interface.
 * 
 * Features:
 * - Keyword-based response matching with fuzzy search
 * - Responsive UI with user/bot message bubbles
 * - Easy keyword management through JSON configuration
 * - Fallback responses for unmatched queries
 * - Lightweight and modular design
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { MessageCircle, Send, Bot, User, X, HelpCircle } from 'lucide-react';
import chatResponses from '../data/chatResponses.json';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

interface AIHelperProps {
  /** Theme color for the assistant - matches interface branding */
  themeColor?: string;
  /** Position of the chat widget */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Maximum height of the chat window */
  maxHeight?: string;
}

/**
 * Fuzzy keyword matching function
 * Matches similar words and handles plurals, typos, and variations
 */
const fuzzyMatch = (input: string, keywords: string[]): boolean => {
  const normalizedInput = input.toLowerCase().trim();
  
  return keywords.some(keyword => {
    const normalizedKeyword = keyword.toLowerCase();
    
    // Exact match
    if (normalizedInput.includes(normalizedKeyword)) return true;
    
    // Handle plurals (simple approach)
    if (normalizedInput.includes(normalizedKeyword + 's') || 
        normalizedInput.includes(normalizedKeyword + 'es')) return true;
    
    // Handle singulars
    if (normalizedKeyword.endsWith('s') && 
        normalizedInput.includes(normalizedKeyword.slice(0, -1))) return true;
    
    // Handle common variations
    const variations = {
      'lead': ['pb', 'plumbum'],
      'arsenic': ['as'],
      'cadmium': ['cd'],
      'chromium': ['cr', 'chrome'],
      'nickel': ['ni'],
      'ph': ['acidity', 'alkalinity'],
      'hmpi': ['heavy metal index', 'pollution index']
    };
    
    for (const [key, vars] of Object.entries(variations)) {
      if (normalizedKeyword === key && vars.some(v => normalizedInput.includes(v))) return true;
      if (vars.includes(normalizedKeyword) && normalizedInput.includes(key)) return true;
    }
    
    return false;
  });
};

/**
 * Generate AI response based on user input
 * Scans for keywords and returns appropriate response
 */
const generateResponse = (userInput: string): string => {
  const keywords = chatResponses.keywords;
  
  // Search through all keyword categories
  for (const [, data] of Object.entries(keywords)) {
    if (fuzzyMatch(userInput, data.triggers)) {
      return data.response;
    }
  }
  
  // Return random fallback response if no keywords match
  const fallbacks = chatResponses.fallback_responses;
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

const AIHelpAssistant: React.FC<AIHelperProps> = ({
  themeColor = '#06b6d4',
  position = 'bottom-right',
  maxHeight = '500px'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onToggle = () => setIsOpen(!isOpen);
  const onClose = () => setIsOpen(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Send user message and generate AI response
   */
  const sendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      message: currentInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // Simulate AI thinking time (500ms - 1.5s)
    const thinkingTime = 500 + Math.random() * 1000;
    
    setTimeout(() => {
      const aiResponse = generateResponse(userMessage.message);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        message: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, thinkingTime);
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Add predefined quick questions
   */
  const quickQuestions = [
    "What is HMPI?",
    "How to test water quality?",
    "Is my water safe to drink?",
    "Lead contamination symptoms"
  ];

  const addQuickQuestion = (question: string) => {
    setCurrentInput(question);
    inputRef.current?.focus();
  };

  // Position styles
  const positionStyles = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' }
  };

  return (
    <Box
      position="fixed"
      {...positionStyles[position]}
      zIndex={1000}
      maxW="400px"
      w={{ base: '90vw', md: '400px' }}
    >
      {/* Chat Window */}
      {isOpen && (
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          rounded="xl"
          shadow="2xl"
          mb={4}
          overflow="hidden"
          maxH={maxHeight}
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <HStack
            bg={themeColor}
            color="white"
            p={4}
            justify="space-between"
          >
            <HStack>
              <Bot size={20} />
              <VStack align="start" gap={0}>
                <Text fontSize="sm" fontWeight="bold">JalArogya Assistant</Text>
                <Text fontSize="xs" opacity={0.9}>How can I Help You??</Text>
              </VStack>
            </HStack>
            <Button
              aria-label="Close chat"
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          </HStack>

          {/* Messages Area */}
          <Box
            flex={1}
            overflowY="auto"
            p={4}
            bg="gray.50"
            maxH="300px"
            minH="200px"
          >
            {messages.length === 0 ? (
              // Welcome message
              <VStack gap={4} textAlign="center" py={4}>
                <Bot size={40} style={{ color: themeColor }} />
                <Text fontSize="sm" color="gray.600">
                  Hello! I'm your JalArogya water quality assistant. I can help you understand HMPI, heavy metals, testing procedures, and treatment options.
                </Text>
                
                {/* Quick question buttons */}
                <VStack gap={2} w="full">
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    Quick Questions:
                  </Text>
                  {quickQuestions.map((question, idx) => (
                    <Button
                      key={idx}
                      size="xs"
                      variant="outline"
                      colorScheme="blue"
                      onClick={() => addQuickQuestion(question)}
                      w="full"
                    >
                      <HelpCircle size={12} style={{ marginRight: '4px' }} />
                      {question}
                    </Button>
                  ))}
                </VStack>
              </VStack>
            ) : (
              // Chat messages
              <VStack gap={3} align="stretch">
                {messages.map((msg) => (
                  <HStack
                    key={msg.id}
                    justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                    align="start"
                  >
                    {msg.role === 'bot' && (
                      <Box
                        p={1}
                        rounded="full"
                        bg={themeColor}
                        color="white"
                        flexShrink={0}
                      >
                        <Bot size={14} />
                      </Box>
                    )}
                    
                    <Box
                      maxW="80%"
                      bg={msg.role === 'user' ? themeColor : 'white'}
                      color={msg.role === 'user' ? 'white' : 'gray.700'}
                      p={3}
                      rounded="lg"
                      border={msg.role === 'bot' ? '1px solid' : 'none'}
                      borderColor="gray.200"
                      shadow={msg.role === 'bot' ? 'sm' : 'none'}
                    >
                      <Text fontSize="sm" lineHeight="1.4">
                        {msg.message}
                      </Text>
                      <Text
                        fontSize="xs"
                        opacity={0.7}
                        mt={1}
                        textAlign="right"
                      >
                        {msg.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </Box>
                    
                    {msg.role === 'user' && (
                      <Box
                        p={1}
                        rounded="full"
                        bg="blue.500"
                        color="white"
                        flexShrink={0}
                      >
                        <User size={14} />
                      </Box>
                    )}
                  </HStack>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <HStack justify="flex-start" align="center">
                    <Box
                      p={1}
                      rounded="full"
                      bg={themeColor}
                      color="white"
                    >
                      <Bot size={14} />
                    </Box>
                    <HStack
                      bg="white"
                      p={3}
                      rounded="lg"
                      border="1px solid"
                      borderColor="gray.200"
                    >
                      <Text fontSize="sm" color="gray.600">
                        JalArogya is thinking...
                      </Text>
                      <Spinner size="sm" color={themeColor} />
                    </HStack>
                  </HStack>
                )}
                
                <div ref={messagesEndRef} />
              </VStack>
            )}
          </Box>

          {/* Input Area */}
          <HStack p={4} bg="white" borderTop="1px solid" borderColor="gray.200">
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about water quality, HMPI, metals..."
              size="sm"
              flex={1}
              disabled={isTyping}
            />
            <Button
              onClick={sendMessage}
              disabled={!currentInput.trim() || isTyping}
              bg={themeColor}
              color="white"
              size="sm"
              _hover={{ opacity: 0.8 }}
            >
              <Send size={16} />
            </Button>
          </HStack>
        </Box>
      )}

      {/* Chat Toggle Button */}
      <Box position="relative">
        <Button
          aria-label={isOpen ? "Close chat" : "Open chat"}
          onClick={onToggle}
          bg={themeColor}
          color="white"
          size="lg"
          rounded="full"
          shadow="xl"
          _hover={{
            transform: 'scale(1.05)',
            shadow: '2xl'
          }}
          transition="all 0.2s ease"
          p={3}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <MessageCircle size={24} />
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default AIHelpAssistant;
