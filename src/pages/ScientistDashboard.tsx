import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { Upload, Download, Database } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { WaterSample, ProcessedData, ScientistProfile } from '../types';
import { parseExcel, processWaterSamples, generateSampleData } from '../utils/dataProcessing';
import { exportToExcel, exportToPDF, exportSampleTemplateCSV, importFromJSON, importFromCSV } from '../utils/exportUtils';
import { demoScientists } from '../data/demoData';
import DataVisualization from '../components/DataVisualization';
import AIHelpAssistant from '../components/AIHelpAssistant';
import { useInterfaceStyles } from '../hooks/useInterfaceStyles';

// Add keyframe animation for shimmer effect
const shimmerAnimation = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

// Inject the CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = shimmerAnimation;
  document.head.appendChild(style);
}

const ScientistDashboard: React.FC = () => {
  const styles = useInterfaceStyles('scientist');
  const [data, setData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      let samples: WaterSample[];
      let errors: string[] = [];
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      if (file.name.endsWith('.csv')) {
        const result = await importFromCSV(file);
        samples = result.samples;
        errors = result.errors;
      } else if (file.name.endsWith('.json')) {
        const result = await importFromJSON(file);
        samples = result.samples;
        errors = result.errors;
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        samples = await parseExcel(file);
      } else {
        throw new Error('Unsupported file format. Please use CSV, JSON, or Excel files.');
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      const processedData = processWaterSamples(samples);
      setData(processedData);

      let message = `File Processed Successfully! Processed ${samples.length} water samples`;
      if (errors.length > 0) {
        message += `\n${errors.length} rows had errors and were skipped.`;
      }
      alert(message);
    } catch (err: unknown) {
      alert(`Error Processing File: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const loadDemoData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const samples = generateSampleData(50);
      const processedData = processWaterSamples(samples);
      setData(processedData);
      setIsProcessing(false);
      
      alert('Demo Data Loaded! Loaded 50 sample water quality measurements');
    }, 1000);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    if (!data) return;
    
    try {
      if (format === 'excel') {
        exportToExcel(data);
      } else {
        exportToPDF(data);
      }
      
      alert(`Report exported as ${format.toUpperCase()}`);
    } catch {
      alert('Export Failed: Error generating report');
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg={styles.currentGradient} 
      py={8}
    >
      <Container maxW="7xl">
        <VStack gap={8}>
          {/* Hero Header */}
          <Box textAlign="center" py={6}>
            <HStack justify="center" mb={4}>
              <Box 
                w="60px" 
                h="60px" 
                rounded="full" 
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="lg"
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
                JalArogya Scientist Dashboard
              </Heading>
            </HStack>
            <Text 
              fontSize="lg" 
              color="whiteAlpha.900" 
              maxW="600px" 
              mx="auto"
              textShadow="1px 1px 2px rgba(0,0,0,0.2)"
            >
              Advanced Water Quality Analysis & Heavy Metal Pollution Index (HMPI) Calculator
            </Text>
          </Box>
          {/* Enhanced Header Stats */}
          {data && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} w="full">
              <Box 
                bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" 
                p={6} 
                rounded="xl" 
                shadow="xl"
                textAlign="center"
                transform="auto"
                _hover={{ scale: 1.05 }}
                transition="all 0.3s ease"
                position="relative"
                overflow="hidden"
              >
                <Box 
                  position="absolute" 
                  top="-20px" 
                  right="-20px" 
                  w="80px" 
                  h="80px" 
                  bg="whiteAlpha.200" 
                  rounded="full"
                />
                <Text fontSize="3xl" fontWeight="900" color="white" mb={2}>
                  {data.summary.totalSamples}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900" fontWeight="600">
                  📋 Total Samples
                </Text>
              </Box>
              
              <Box 
                bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" 
                p={6} 
                rounded="xl" 
                shadow="xl"
                textAlign="center"
                transform="auto"
                _hover={{ scale: 1.05 }}
                transition="all 0.3s ease"
                position="relative"
                overflow="hidden"
              >
                <Box 
                  position="absolute" 
                  top="-20px" 
                  right="-20px" 
                  w="80px" 
                  h="80px" 
                  bg="whiteAlpha.200" 
                  rounded="full"
                />
                <Text fontSize="3xl" fontWeight="900" color="white" mb={2}>
                  {data.summary.safeCount}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900" fontWeight="600">
                  ✅ Safe Samples
                </Text>
              </Box>
              
              <Box 
                bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" 
                p={6} 
                rounded="xl" 
                shadow="xl"
                textAlign="center"
                transform="auto"
                _hover={{ scale: 1.05 }}
                transition="all 0.3s ease"
                position="relative"
                overflow="hidden"
              >
                <Box 
                  position="absolute" 
                  top="-20px" 
                  right="-20px" 
                  w="80px" 
                  h="80px" 
                  bg="whiteAlpha.200" 
                  rounded="full"
                />
                <Text fontSize="3xl" fontWeight="900" color="white" mb={2}>
                  {data.summary.moderateCount}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900" fontWeight="600">
                  ⚠️ Moderate Risk
                </Text>
              </Box>
              
              <Box 
                bg="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)" 
                p={6} 
                rounded="xl" 
                shadow="xl"
                textAlign="center"
                transform="auto"
                _hover={{ scale: 1.05 }}
                transition="all 0.3s ease"
                position="relative"
                overflow="hidden"
              >
                <Box 
                  position="absolute" 
                  top="-20px" 
                  right="-20px" 
                  w="80px" 
                  h="80px" 
                  bg="whiteAlpha.200" 
                  rounded="full"
                />
                <Text fontSize="3xl" fontWeight="900" color="white" mb={2}>
                  {data.summary.unsafeCount}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900" fontWeight="600">
                  ❌ Unsafe Samples
                </Text>
              </Box>
            </SimpleGrid>
          )}

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} w="full">
          {/* Enhanced Upload Section */}
          <Box 
            bg="white" 
            p={8} 
            rounded="2xl" 
            shadow="2xl"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              bgGradient: 'linear(to-r, #667eea, #764ba2)'
            }}
          >
            <HStack mb={6}>
              <Box 
                p={3} 
                rounded="xl" 
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
              >
                <Upload size={24} />
              </Box>
              <VStack align="start" gap={1}>
                <Heading size="lg" color="gray.800">
                  📤 Data Upload Center
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Import water quality samples for analysis
                </Text>
              </VStack>
            </HStack>
            
            <VStack gap={6}>
              {/* Enhanced Drag and Drop Area */}
              <Box
                {...getRootProps()}
                p={10}
                border="3px dashed"
                borderColor={isDragActive ? "purple.400" : "gray.300"}
                borderRadius="2xl"
                bg={isDragActive ? "purple.50" : "gray.50"}
                cursor="pointer"
                textAlign="center"
                w="full"
                transition="all 0.3s ease"
                transform="auto"
                _hover={{ 
                  borderColor: "purple.400", 
                  bg: "purple.50",
                  scale: 1.02
                }}
                position="relative"
                minH="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <input {...getInputProps()} />
                <VStack gap={4}>
                  <Box 
                    p={4} 
                    rounded="full" 
                    bg={isDragActive ? "purple.100" : "gray.200"}
                    transition="all 0.3s ease"
                  >
                    <Database size={56} className={isDragActive ? "text-purple-500" : "text-gray-500"} />
                  </Box>
                  <VStack gap={2}>
                    <Text fontWeight="bold" fontSize="lg" color="gray.700">
                      {isDragActive ? "🎆 Drop files here!" : "📁 Drop CSV/JSON/Excel files here"}
                    </Text>
                    <Text fontSize="md" color="gray.600">
                      or click to browse files
                    </Text>
                    <HStack gap={2} flexWrap="wrap" justify="center">
                      <Badge colorScheme="blue" variant="subtle">.csv</Badge>
                      <Badge colorScheme="green" variant="subtle">.json</Badge>
                      <Badge colorScheme="orange" variant="subtle">.xlsx</Badge>
                      <Badge colorScheme="purple" variant="subtle">.xls</Badge>
                    </HStack>
                  </VStack>
                </VStack>
              </Box>

              {isProcessing && (
                <Box w="full" p={4} bg="gray.50" rounded="xl" border="1px" borderColor="gray.200">
                  <HStack justify="space-between" mb={3}>
                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                      🚀 Processing file...
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="purple.600">
                      {uploadProgress}%
                    </Text>
                  </HStack>
                  <Box 
                    w="full" 
                    h="3" 
                    bg="gray.200" 
                    rounded="full" 
                    overflow="hidden"
                    position="relative"
                  >
                    <Box
                      h="full"
                      bg="linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                      rounded="full"
                      width={`${uploadProgress}%`}
                      transition="width 0.3s ease"
                      position="relative"
                      _after={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bg: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                  </Box>
                </Box>
              )}

              <HStack gap={3} w="full">
                <Button
                  onClick={exportSampleTemplateCSV}
                  variant="outline"
                  size="md"
                  flex={1}
                  borderColor="purple.300"
                  color="purple.600"
                  _hover={{
                    bg: 'purple.50',
                    borderColor: 'purple.400',
                    transform: 'translateY(-1px)',
                    shadow: 'md'
                  }}
                  transition="all 0.2s ease"
                  fontWeight="600"
                >
                  📥 Download Template
                </Button>
                <Button
                  onClick={loadDemoData}
                  colorScheme="purple"
                  size="md"
                  flex={1}
                  disabled={isProcessing}
                  _hover={{
                    transform: 'translateY(-1px)',
                    shadow: 'xl'
                  }}
                  transition="all 0.2s ease"
                  fontWeight="600"
                >
                  {isProcessing ? '🔄 Loading...' : '🎲 Load Demo Data'}
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Enhanced Export Section */}
          <Box 
            bg="white" 
            p={8} 
            rounded="2xl" 
            shadow="2xl"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              bgGradient: 'linear(to-r, #43e97b, #38f9d7)'
            }}
          >
            <HStack mb={6}>
              <Box 
                p={3} 
                rounded="xl" 
                bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                color="white"
              >
                <Download size={24} />
              </Box>
              <VStack align="start" gap={1}>
                <Heading size="lg" color="gray.800">
                  📤 Export & Analytics
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Generate comprehensive analysis reports
                </Text>
              </VStack>
            </HStack>
            
            <VStack gap={6}>
              {data ? (
                <>
                  <Box 
                    p={4} 
                    bg="linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)" 
                    border="1px solid" 
                    borderColor="green.200" 
                    rounded="xl"
                    w="full"
                    position="relative"
                    overflow="hidden"
                  >
                    <HStack justify="space-between">
                      <VStack align="start" gap={1}>
                        <Text color="green.800" fontSize="sm" fontWeight="bold">
                          ✅ Data Ready for Export
                        </Text>
                        <Text color="green.700" fontSize="xs">
                          {data.summary.totalSamples} samples processed successfully
                        </Text>
                      </VStack>
                      <Box 
                        p={2} 
                        bg="green.100" 
                        rounded="full"
                        color="green.600"
                      >
                        📈
                      </Box>
                    </HStack>
                  </Box>
                  
                  <SimpleGrid columns={2} gap={4} w="full">
                    <Button
                      onClick={() => handleExport('excel')}
                      bg="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                      color="white"
                      size="lg"
                      py={6}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'xl'
                      }}
                      transition="all 0.2s ease"
                      fontWeight="600"
                    >
                      <VStack gap={1}>
                        <Text fontSize="md">📈 Export Excel</Text>
                        <Text fontSize="xs" opacity={0.9}>Detailed Analysis</Text>
                      </VStack>
                    </Button>
                    <Button
                      onClick={() => handleExport('pdf')}
                      bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                      color="white"
                      size="lg"
                      py={6}
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'xl'
                      }}
                      transition="all 0.2s ease"
                      fontWeight="600"
                    >
                      <VStack gap={1}>
                        <Text fontSize="md">📋 Export PDF</Text>
                        <Text fontSize="xs" opacity={0.9}>Summary Report</Text>
                      </VStack>
                    </Button>
                  </SimpleGrid>

                  <Box 
                    w="full" 
                    p={4} 
                    bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" 
                    rounded="xl"
                    border="1px"
                    borderColor="gray.200"
                  >
                    <Text fontSize="sm" fontWeight="bold" mb={3} color="gray.700">
                      📊 Statistical Summary:
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.600">Safety Distribution</Text>
                        <HStack gap={2}>
                          <Badge colorScheme="green" variant="subtle">{((data.summary.safeCount / data.summary.totalSamples) * 100).toFixed(1)}%</Badge>
                          <Badge colorScheme="yellow" variant="subtle">{((data.summary.moderateCount / data.summary.totalSamples) * 100).toFixed(1)}%</Badge>
                          <Badge colorScheme="red" variant="subtle">{((data.summary.unsafeCount / data.summary.totalSamples) * 100).toFixed(1)}%</Badge>
                        </HStack>
                      </VStack>
                      <VStack align="start" gap={1}>
                        <Text fontSize="xs" color="gray.600">Index Averages</Text>
                        <HStack gap={2}>
                          <Badge variant="outline">HMPI: {data.summary.averageHMPI}</Badge>
                          <Badge variant="outline">HPI: {data.summary.averageHPI}</Badge>
                        </HStack>
                      </VStack>
                    </Grid>
                  </Box>
                </>
              ) : (
                <Box 
                  p={6} 
                  bg="linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" 
                  border="1px solid" 
                  borderColor="blue.200" 
                  rounded="xl"
                  textAlign="center"
                >
                  <VStack gap={3}>
                    <Box fontSize="3xl">📁</Box>
                    <VStack gap={1}>
                      <Text color="blue.800" fontSize="sm" fontWeight="bold">
                        No Data Available
                      </Text>
                      <Text color="blue.700" fontSize="xs">
                        Upload water quality data to enable report generation
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              )}
            </VStack>
          </Box>
        </Grid>

        {/* Enhanced Data Visualization */}
        {data && (
          <Box 
            bg="white" 
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
              bgGradient: 'linear(to-r, #667eea, #764ba2)'
            }}
          >
            <HStack mb={6} justify="space-between">
              <HStack>
                <Box 
                  p={3} 
                  rounded="xl" 
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                >
                  📊
                </Box>
                <VStack align="start" gap={1}>
                  <Heading size="lg" color="gray.800">
                    📊 Data Analysis & Visualization
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Interactive charts and statistical insights
                  </Text>
                </VStack>
              </HStack>
              <Badge 
                colorScheme="purple" 
                variant="subtle" 
                fontSize="sm" 
                px={3} 
                py={1}
                rounded="full"
              >
                {data.results.length} Samples Analyzed
              </Badge>
            </HStack>
            <Box 
              p={4} 
              bg="gray.50" 
              rounded="xl" 
              border="1px" 
              borderColor="gray.200"
            >
              <DataVisualization data={data} />
            </Box>
          </Box>
        )}

        {/* Enhanced Scientist Information Panel */}
        <Box 
          bg="white" 
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
            bgGradient: 'linear(to-r, #4facfe, #00f2fe)'
          }}
        >
          <HStack mb={6}>
            <Box 
              p={3} 
              rounded="xl" 
              bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              color="white"
            >
              👥
            </Box>
            <VStack align="start" gap={1}>
              <Heading size="lg" color="gray.800">
                👥 Contributing Scientists
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Expert researchers and water quality specialists
              </Text>
            </VStack>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {demoScientists.slice(0, 6).map((scientist: ScientistProfile, index: number) => (
              <Box 
                key={index} 
                p={6} 
                border="1px" 
                borderColor="gray.200" 
                rounded="xl"
                bg="linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                  borderColor: 'blue.300'
                }}
                transition="all 0.2s ease"
                position="relative"
                overflow="hidden"
              >
                <Box 
                  position="absolute"
                  top={0}
                  right={0}
                  w="20px"
                  h="20px"
                  bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                  transform="translate(50%, -50%) rotate(45deg)"
                />
                <VStack align="start" gap={3}>
                  <VStack align="start" gap={1} w="full">
                    <Text fontWeight="bold" color="blue.700" fontSize="lg">
                      {scientist.name}
                    </Text>
                    <Text fontSize="sm" color="purple.600" fontWeight="600">
                      {scientist.specialization}
                    </Text>
                    <Text fontSize="xs" color="gray.600" fontStyle="italic">
                      {scientist.institution}
                    </Text>
                  </VStack>
                  <HStack justify="space-between" w="full">
                    <Badge 
                      colorScheme="green" 
                      variant="subtle"
                      rounded="full"
                      px={3}
                      py={1}
                    >
                      {scientist.experience}
                    </Badge>
                    <HStack>
                      <Badge variant="outline" size="sm" rounded="full">
                        🏅 {scientist.certifications.length}
                      </Badge>
                    </HStack>
                  </HStack>
                  <Box w="full">
                    <Text 
                      fontSize="xs" 
                      color="gray.700"
                    >
                      <strong>Expertise:</strong> {scientist.certifications.slice(0, 2).join(', ')}
                      {scientist.certifications.length > 2 && ` +${scientist.certifications.length - 2} more`}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Enhanced Results Table */}
        {data && (
          <Box 
            bg="white" 
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
              bgGradient: 'linear(to-r, #fa709a, #fee140)'
            }}
          >
            <HStack mb={6} justify="space-between">
              <HStack>
                <Box 
                  p={3} 
                  rounded="xl" 
                  bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                  color="white"
                >
                  📋
                </Box>
                <VStack align="start" gap={1}>
                  <Heading size="lg" color="gray.800">
                    📋 Sample Results
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Detailed analysis results for all water samples
                  </Text>
                </VStack>
              </HStack>
              <Badge 
                colorScheme="orange" 
                variant="subtle" 
                fontSize="sm" 
                px={3} 
                py={1}
                rounded="full"
              >
                {data.results.length} Total Results
              </Badge>
            </HStack>
            <Box 
              overflowX="auto" 
              bg="gray.50" 
              rounded="xl" 
              p={4}
              border="1px"
              borderColor="gray.200"
            >
              <Box overflowX="auto">
                <table style={{
                  width: '100%', 
                  fontSize: '14px', 
                  borderCollapse: 'collapse',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}>
                      <th style={{
                        padding: '16px 12px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '13px',
                        letterSpacing: '0.5px'
                      }}>Sample ID</th>
                      <th style={{
                        padding: '16px 12px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '13px',
                        letterSpacing: '0.5px'
                      }}>Location</th>
                      <th style={{
                        padding: '16px 12px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '13px',
                        letterSpacing: '0.5px'
                      }}>HMPI</th>
                      <th style={{
                        padding: '16px 12px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '13px',
                        letterSpacing: '0.5px'
                      }}>HPI</th>
                      <th style={{
                        padding: '16px 12px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '13px',
                        letterSpacing: '0.5px'
                      }}>Classification</th>
                      <th style={{
                        padding: '16px 12px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '13px',
                        letterSpacing: '0.5px'
                      }}>Risk Level</th>
                      <th style={{
                        padding: '16px 12px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '13px',
                        letterSpacing: '0.5px'
                      }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.slice(0, 20).map((result, index) => {
                      const sample = data.samples.find(s => s.id === result.sampleId);
                      return (
                        <tr 
                          key={result.sampleId} 
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0f4f8';
                            e.currentTarget.style.transform = 'scale(1.01)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <td style={{padding: '8px', fontFamily: 'monospace', fontSize: '12px'}}>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                              <span>{result.sampleId}</span>
                              <span style={{fontSize: '10px', color: '#666'}}>
                                by {sample?.collectedBy || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td style={{padding: '8px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {sample?.location || 'N/A'}
                          </td>
                          <td style={{padding: '8px', fontWeight: 'bold'}}>{result.hmpi}</td>
                          <td style={{padding: '8px', fontWeight: 'bold'}}>{result.hpi}</td>
                          <td style={{padding: '8px'}}>
                            <Badge
                              colorScheme={
                                result.classification === 'Safe' ? 'green' :
                                result.classification === 'Moderate' ? 'yellow' : 'red'
                              }
                            >
                              {result.classification}
                            </Badge>
                          </td>
                          <td style={{padding: '8px'}}>
                            <Badge
                              colorScheme={
                                result.riskLevel === 'Low' ? 'green' :
                                result.riskLevel === 'Medium' ? 'yellow' :
                                result.riskLevel === 'High' ? 'orange' : 'red'
                              }
                            >
                              {result.riskLevel}
                            </Badge>
                          </td>
                          <td style={{padding: '8px', fontSize: '12px'}}>
                            {sample?.sampleDate.toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>
              {data.results.length > 20 && (
                <Text fontSize="sm" color="gray.600" mt={4} textAlign="center">
                  📄 Showing first 20 of {data.results.length} results
                </Text>
              )}
            </Box>
          </Box>
        )}      
        </VStack>
      </Container>
      
      {/* AI Help Assistant */}
      <AIHelpAssistant 
        themeColor="#667eea"
        position="bottom-right"
      />
    </Box>
  );
};

export default ScientistDashboard;