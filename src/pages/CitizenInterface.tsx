import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Textarea,
} from '@chakra-ui/react';
import { Calculator, MapPin, AlertCircle, X } from 'lucide-react';
import type { WaterSample, HMPIResult, LocationData, MapMarker } from '../types';
import { processSample } from '../utils/hmpiCalculations';
import { validateSample } from '../utils/dataProcessing';
import { getNearbyLocations, generateMetalContaminationData, waterQualityGuide, demoSamples, demoRegionalAnalysis } from '../data/demoData';
import WaterQualityMap from '../components/WaterQualityMap';
import AIHelpAssistant from '../components/AIHelpAssistant';
import { useLanguage } from '../hooks/useLanguage';
import { useInterfaceStyles } from '../hooks/useInterfaceStyles';

interface CitizenFormData {
  latitude: string;
  longitude: string;
  pb: string;
  as: string;
  cd: string;
  cr: string;
  ni: string;
  pH: string;
  conductivity: string;
  location: string;
}

const CitizenInterface: React.FC = () => {
  const { t } = useLanguage();
  const styles = useInterfaceStyles('citizen');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<CitizenFormData>({
    latitude: '',
    longitude: '',
    pb: '',
    as: '',
    cd: '',
    cr: '',
    ni: '',
    pH: '',
    conductivity: '',
    location: '',
  });
  
  // Reporting feature state
  const [reportData, setReportData] = useState({
    file: null as File | null,
    location: { latitude: '', longitude: '' },
    description: ''
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const [result, setResult] = useState<HMPIResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState<(LocationData & { 
    distance?: number; 
    metalContamination: Record<string, number>; 
    hpi: number 
  })[]>([]);
  const [showNearbyData, setShowNearbyData] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  


  const handleInputChange = (field: keyof CitizenFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lon.toString(),
          }));
          
          // Get nearby locations
          const nearby = getNearbyLocations(lat, lon, 15);
          const enhancedNearby = nearby.map(location => ({
            ...location,
            metalContamination: generateMetalContaminationData(location),
            hpi: Math.round(location.averageHMPI * 1.2), // Estimate HPI from HMPI
          }));
          setNearbyLocations(enhancedNearby);
          setShowNearbyData(true);
          
          // Create map markers for nearby locations and demo samples
          const markers: MapMarker[] = [
            ...enhancedNearby.map(location => ({
              id: location.id,
              position: location.coordinates,
              classification: location.classification,
              popup: `${location.name} - HMPI: ${location.averageHMPI.toFixed(1)}`,
              data: {
                id: location.id,
                latitude: location.coordinates[0],
                longitude: location.coordinates[1],
                pb: 0, as: 0, cd: 0, cr: 0, ni: 0, pH: 7, conductivity: 400,
                sampleDate: new Date(),
                location: location.name
              }
            })),
            ...demoSamples.slice(0, 10).map(sample => {
              const classification: 'Safe' | 'Moderate' | 'Unsafe' = 
                sample.pb > 0.015 || sample.as > 0.015 ? 'Unsafe' :
                sample.pb > 0.01 || sample.as > 0.01 ? 'Moderate' : 'Safe';
              
              return {
                id: sample.id,
                position: [sample.latitude, sample.longitude] as [number, number],
                classification,
                popup: `${sample.location} - Sample: ${sample.id}`,
                data: sample
              };
            })
          ];
          setMapMarkers(markers);
          
          alert('Location updated successfully!');
        },
        () => {
          alert('Unable to get your current location.');
        }
      );
    }
  };

  const calculateHMPI = () => {
    setIsCalculating(true);
    
    const sample: Partial<WaterSample> = {
      id: 'citizen_input',
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      pb: parseFloat(formData.pb),
      as: parseFloat(formData.as),
      cd: parseFloat(formData.cd),
      cr: parseFloat(formData.cr),
      ni: parseFloat(formData.ni),
      pH: parseFloat(formData.pH),
      conductivity: parseFloat(formData.conductivity),
      location: formData.location,
      sampleDate: new Date(),
    };

    const validationErrors = validateSample(sample);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsCalculating(false);
      return;
    }

    setTimeout(() => {
      const hmpiResult = processSample(sample as WaterSample);
      setResult(hmpiResult);
      setIsCalculating(false);
      
      alert(`Analysis Complete! Water quality: ${hmpiResult.classification}`);
    }, 1500);
  };

  // Reporting feature functions
  const handleReportModalOpen = () => {
    // Auto-capture location when modal opens
    captureCurrentLocation();
    setIsReportModalOpen(true);
  };

  const captureCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6)
            }
          }));
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          alert('Unable to get current location. Please enable location services.');
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Please select a file smaller than 10MB.');
        return;
      }
      setReportData(prev => ({ ...prev, file }));
    }
  };

  const handleReportSubmit = () => {
    // Validate form
    if (!reportData.description.trim()) {
      alert('Please provide a description of the issue.');
      return;
    }

    // Log to console (prototype only)
    console.log('=== CITIZEN REPORT SUBMITTED (PROTOTYPE) ===');
    console.log('File:', reportData.file);
    console.log('Location:', reportData.location);
    console.log('Description:', reportData.description);
    console.log('Timestamp:', new Date().toISOString());
    console.log('============================================');

    // Show success message
    alert('Issue submitted (prototype only) ✅');

    // Reset form and close modal
    setReportData({
      file: null,
      location: { latitude: '', longitude: '' },
      description: ''
    });
    setIsReportModalOpen(false);
  };



  return (
    <Box 
      minH="100vh" 
      bg={styles.currentGradient} 
      py={8}
    >
      <Container maxW="7xl">
        {/* Hero Header */}
        <Box textAlign="center" py={6} mb={8}>
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
              {t('citizen.title')}
            </Heading>
          </HStack>
          <Text 
            fontSize="lg" 
            color="whiteAlpha.900" 
            maxW="600px" 
            mx="auto"
            textShadow="1px 1px 2px rgba(0,0,0,0.2)"
          >
            {t('citizen.subtitle')}
          </Text>
        </Box>

        <VStack gap={8} w="full">
          {/* Report Issue Button */}
          <Box w="full" textAlign="center">
            <Button
              onClick={handleReportModalOpen}
              bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
              color="white"
              size="lg"
              px={8}
              py={6}
              fontWeight="600"
              rounded="xl"
              shadow="lg"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'xl',
                bg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              }}
              transition="all 0.2s ease"
            >
              <AlertCircle size={20} style={{ marginRight: '8px' }} />
              📢 Report an Issue
            </Button>
          </Box>

          {/* Water Quality Calculator Section */}
          <Box w="full" maxW="500px" mx="auto">
            <Box 
              bg={styles.cardBackground} 
              p={8} 
              rounded="2xl" 
              shadow={styles.shadow}
              position="relative"
              overflow="hidden"
              border={styles.isDark ? '1px solid' : 'none'}
              borderColor={styles.borderColor}
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgGradient: styles.currentCardGradient
              }}
            >
              <HStack mb={6}>
                <Box 
                  p={3} 
                  rounded="xl" 
                  bg={styles.currentGradient}
                  color="white"
                >
                  <Calculator size={24} />
                </Box>
                <VStack align="start" gap={1}>
                  <Heading size="lg" color={styles.primaryText}>
                    🧮 {t('citizen.calculator')}
                  </Heading>
                  <Text fontSize="sm" color={styles.secondaryText}>
                    {t('citizen.calculatorDesc')}
                  </Text>
                </VStack>
              </HStack>
            
            <VStack gap={{ base: 3, md: 4 }}>
              {/* Location */}
              <Box w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold" color={styles.primaryText}>{t('citizen.location')}</Text>
                  <HStack>
                    <Text fontSize="sm" color={styles.secondaryText}>{t('citizen.useCurrentLocation')}</Text>
                    <input
                      type="checkbox"
                      checked={useCurrentLocation}
                      onChange={(e) => {
                        setUseCurrentLocation(e.target.checked);
                        if (e.target.checked) getCurrentLocation();
                      }}
                    />
                  </HStack>
                </HStack>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="sm" mb={1} color={styles.secondaryText}>{t('citizen.latitude')}</Text>
                    <Input
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      placeholder="28.6139"
                      size="sm"
                      bg={styles.isDark ? 'rgba(51, 65, 85, 0.5)' : 'white'}
                      borderColor={styles.isDark ? 'rgba(71, 85, 105, 0.5)' : 'gray.200'}
                      color={styles.primaryText}
                      _placeholder={{ color: styles.mutedText }}
                      _focus={{ 
                        borderColor: styles.isDark ? '#059669' : '#43e97b',
                        shadow: 'md'
                      }}
                    />
                  </Box>
                  <Box>
                    <Text fontSize="sm" mb={1} color={styles.secondaryText}>{t('citizen.longitude')}</Text>
                    <Input
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      placeholder="77.2090"
                      size="sm"
                      bg={styles.isDark ? 'rgba(51, 65, 85, 0.5)' : 'white'}
                      borderColor={styles.isDark ? 'rgba(71, 85, 105, 0.5)' : 'gray.200'}
                      color={styles.primaryText}
                      _placeholder={{ color: styles.mutedText }}
                      _focus={{ 
                        borderColor: styles.isDark ? '#059669' : '#43e97b',
                        shadow: 'md'
                      }}
                    />
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Interactive Map */}
              <Box w="full">
                <Text fontWeight="bold" mb={3}>{t('citizen.mapTitle')}</Text>
                <Box 
                  h={{ base: "250px", md: "280px" }} 
                  border="1px" 
                  borderColor="gray.200" 
                  rounded="lg" 
                  overflow="hidden"
                  position="relative"
                  zIndex={1}
                >
                  <WaterQualityMap 
                    data={mapMarkers}
                    center={formData.latitude && formData.longitude ? 
                      [parseFloat(formData.latitude), parseFloat(formData.longitude)] : undefined}
                    zoom={6}
                    height="280px"
                    interactive={true}
                    showStates={true}
                  />
                </Box>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {t('citizen.mapDescription')}
                </Text>
              </Box>

              {/* Heavy Metals */}
              <Box w="full">
                <Text fontWeight="bold" mb={3}>{t('citizen.heavyMetals')}</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="sm" mb={1}>Lead (Pb)</Text>
                    <Input
                      value={formData.pb}
                      onChange={(e) => handleInputChange('pb', e.target.value)}
                      placeholder="0.005"
                      size="sm"
                    />
                    <Text fontSize="xs" color="gray.500">WHO: 0.01 mg/L</Text>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" mb={1}>Arsenic (As)</Text>
                    <Input
                      value={formData.as}
                      onChange={(e) => handleInputChange('as', e.target.value)}
                      placeholder="0.003"
                      size="sm"
                    />
                    <Text fontSize="xs" color="gray.500">WHO: 0.01 mg/L</Text>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" mb={1}>Cadmium (Cd)</Text>
                    <Input
                      value={formData.cd}
                      onChange={(e) => handleInputChange('cd', e.target.value)}
                      placeholder="0.001"
                      size="sm"
                    />
                    <Text fontSize="xs" color="gray.500">WHO: 0.003 mg/L</Text>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" mb={1}>Chromium (Cr)</Text>
                    <Input
                      value={formData.cr}
                      onChange={(e) => handleInputChange('cr', e.target.value)}
                      placeholder="0.025"
                      size="sm"
                    />
                    <Text fontSize="xs" color="gray.500">WHO: 0.05 mg/L</Text>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" mb={1}>Nickel (Ni)</Text>
                    <Input
                      value={formData.ni}
                      onChange={(e) => handleInputChange('ni', e.target.value)}
                      placeholder="0.035"
                      size="sm"
                    />
                    <Text fontSize="xs" color="gray.500">WHO: 0.07 mg/L</Text>
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Water Parameters */}
              <Box w="full">
                <Text fontWeight="bold" mb={3}>{t('citizen.waterParameters')}</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                  <Box>
                    <Text fontSize="sm" mb={1}>pH</Text>
                    <Input
                      value={formData.pH}
                      onChange={(e) => handleInputChange('pH', e.target.value)}
                      placeholder="7.2"
                      size="sm"
                    />
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" mb={1}>Conductivity (μS/cm)</Text>
                    <Input
                      value={formData.conductivity}
                      onChange={(e) => handleInputChange('conductivity', e.target.value)}
                      placeholder="450"
                      size="sm"
                    />
                  </Box>
                </SimpleGrid>
              </Box>

              {errors.length > 0 && (
                <Box bg="red.50" border="1px solid" borderColor="red.200" p={3} rounded="md" w="full">
                  <VStack align="start" gap={1}>
                    {errors.map((error, index) => (
                      <Text key={index} fontSize="sm" color="red.600">{error}</Text>
                    ))}
                  </VStack>
                </Box>
              )}

              <Button
                bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                color="white"
                size="lg"
                w="full"
                onClick={calculateHMPI}
                disabled={isCalculating}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'xl'
                }}
                transition="all 0.2s ease"
                fontWeight="600"
                py={6}
              >
                <Calculator size={20} style={{ marginRight: '8px' }} />
                {isCalculating ? `🔄 ${t('common.analyzing')}` : `🧮 ${t('citizen.calculateWaterQuality')}`}
              </Button>
            </VStack>
            </Box>
          </Box>

          {/* Results and Other Sections */}
          <Box 
            maxW="1200px" 
            mx="auto" 
            w="full"
            px={4}
          >
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              gap={6} 
              w="full"
              templateColumns={{ lg: "repeat(3, 1fr)" }}
              alignItems="start"
            >
            {/* Enhanced Analysis Results */}
            {result && (
              <Box 
                bg="white" 
                p={6} 
                rounded="2xl" 
                shadow="2xl"
                position="relative"
                overflow="hidden"
                w="full"
                h="fit-content"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  bgGradient: result.classification === 'Safe' ? 'linear(to-r, #10b981, #34d399)' : 
                             result.classification === 'Moderate' ? 'linear(to-r, #f59e0b, #fbbf24)' : 
                             'linear(to-r, #ef4444, #f87171)'
                }}
              >
                <HStack mb={6}>
                  <Box 
                    p={3} 
                    rounded="xl" 
                    bg={result.classification === 'Safe' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 
                        result.classification === 'Moderate' ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' : 
                        'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'}
                    color="white"
                  >
                    {result.classification === 'Safe' ? '✅' : 
                     result.classification === 'Moderate' ? '⚠️' : '❌'}
                  </Box>
                  <VStack align="start" gap={1}>
                    <Heading size="lg" color="gray.800">
                      📋 {t('citizen.analysisResults')}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {t('citizen.analysisResultsDesc')}
                    </Text>
                  </VStack>
                </HStack>
                <VStack gap={4}>
                  <Badge
                    colorScheme={result.classification === 'Safe' ? 'green' : 
                               result.classification === 'Moderate' ? 'yellow' : 'red'}
                    p={3}
                    fontSize="lg"
                    borderRadius="lg"
                  >
                    {result.classification}
                  </Badge>

                  <SimpleGrid columns={2} gap={4} w="full">
                    <Box textAlign="center" p={3} bg="blue.50" rounded="lg">
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        {result.hmpi}
                      </Text>
                      <Text fontSize="sm">HMPI Score</Text>
                    </Box>
                    <Box textAlign="center" p={3} bg="purple.50" rounded="lg">
                      <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                        {result.hpi}
                      </Text>
                      <Text fontSize="sm">HPI Score</Text>
                    </Box>
                  </SimpleGrid>

                  <Box
                    bg={result.classification === 'Safe' ? 'green.50' : 
                        result.classification === 'Moderate' ? 'yellow.50' : 'red.50'}
                    border="1px solid"
                    borderColor={result.classification === 'Safe' ? 'green.200' : 
                                result.classification === 'Moderate' ? 'yellow.200' : 'red.200'}
                    p={3}
                    rounded="lg"
                  >
                    <Text fontSize="sm" fontWeight="bold" color={result.classification === 'Safe' ? 'green.700' : 
                                                                     result.classification === 'Moderate' ? 'yellow.700' : 'red.700'}>
                      {result.classification === 'Safe' ? 'Water meets safety standards' :
                       result.classification === 'Moderate' ? 'Moderate contamination - caution advised' :
                       'High contamination - not safe for drinking'}
                    </Text>
                  </Box>

                  {/* Metal Contamination Breakdown */}
                  <Box w="full" p={3} bg="gray.50" rounded="lg">
                    <Text fontWeight="bold" mb={2} fontSize="sm">Metal Contamination Levels:</Text>
                    <VStack gap={1}>
                      {Object.entries(result.metalContributions).map(([metal, value]) => (
                        <HStack key={metal} justify="space-between" w="full">
                          <Text fontSize="xs">{waterQualityGuide.metals[metal as keyof typeof waterQualityGuide.metals]?.name}</Text>
                          <Badge colorScheme={value > 100 ? 'red' : value > 50 ? 'yellow' : 'green'} size="sm">
                            {value.toFixed(1)}%
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  {/* Water Usability Assessment */}
                  <Box w="full" p={4} bg="blue.50" border="1px" borderColor="blue.200" rounded="lg">
                    <Text fontWeight="bold" mb={3} fontSize="sm" color="blue.800">
                      Water Usability Assessment
                    </Text>
                    <VStack gap={3}>
                      {/* Drinking Water */}
                      <HStack justify="space-between" w="full" p={2} bg="white" rounded="md">
                        <HStack>
                          <Text fontSize="sm" fontWeight="medium">🚰 Drinking Water</Text>
                        </HStack>
                        <Badge 
                          colorScheme={result.usability.drinking.status === 'Safe' ? 'green' : 
                                     result.usability.drinking.status === 'Caution' ? 'yellow' : 'red'}
                          variant="solid"
                          fontSize="xs"
                        >
                          {result.usability.drinking.status.toUpperCase()}
                        </Badge>
                      </HStack>

                      {/* Farming/Irrigation */}
                      <HStack justify="space-between" w="full" p={2} bg="white" rounded="md">
                        <HStack>
                          <Text fontSize="sm" fontWeight="medium">🌱 Farming/Irrigation</Text>
                        </HStack>
                        <Badge 
                          colorScheme={result.usability.agriculture.status === 'Safe' ? 'green' : 
                                     result.usability.agriculture.status === 'Caution' ? 'yellow' : 'red'}
                          variant="solid"
                          fontSize="xs"
                        >
                          {result.usability.agriculture.status.toUpperCase()}
                        </Badge>
                      </HStack>

                      {/* Industrial Use */}
                      <HStack justify="space-between" w="full" p={2} bg="white" rounded="md">
                        <HStack>
                          <Text fontSize="sm" fontWeight="medium">🏭 Industrial Use</Text>
                        </HStack>
                        <Badge 
                          colorScheme={result.usability.industrial.status === 'Safe' ? 'green' : 
                                     result.usability.industrial.status === 'Caution' ? 'yellow' : 'red'}
                          variant="solid"
                          fontSize="xs"
                        >
                          {result.usability.industrial.status.toUpperCase()}
                        </Badge>
                      </HStack>
                    </VStack>
                  
                    {/* Detailed Usage Guidelines */}
                    <Box mt={3} p={3} bg="white" rounded="md">
                      <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={2}>
                        💡 Detailed Assessment:
                      </Text>
                      <VStack gap={2} align="start">
                        <Box>
                          <Text fontSize="xs" fontWeight="bold" color="blue.700">🚰 Drinking:</Text>
                          <Text fontSize="xs" color="gray.600">{result.usability.drinking.reason}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" fontWeight="bold" color="green.700">🌱 Agriculture:</Text>
                          <Text fontSize="xs" color="gray.600">{result.usability.agriculture.reason}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" fontWeight="bold" color="purple.700">🏭 Industrial:</Text>
                          <Text fontSize="xs" color="gray.600">{result.usability.industrial.reason}</Text>
                        </Box>
                      </VStack>
                    </Box>
                  </Box>
                </VStack>
              </Box>
            )}

            {/* Metal Index Scores */}
            {result && (
              <Box 
                bg="white" 
                p={6} 
                rounded="lg" 
                shadow="sm" 
                w="full"
                h="fit-content"
              >
                <Heading size="md" mb={4}>🧪 Metal Index Scores</Heading>
                <VStack gap={3} maxH="600px" overflowY="auto">
                  {Object.entries(result.metalIndexScores).map(([metalKey, metalData]) => {
                    const metalNames: Record<string, string> = {
                      pb: 'Lead (Pb)',
                      as: 'Arsenic (As)',
                      cd: 'Cadmium (Cd)',
                      cr: 'Chromium (Cr)',
                      ni: 'Nickel (Ni)'
                    };
                    
                    return (
                      <Box key={metalKey} w="full" p={3} bg="purple.50" rounded="md" border="1px" borderColor="purple.200">
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="bold">
                            {metalNames[metalKey]}
                          </Text>
                          <Badge 
                            colorScheme={metalData.status === 'Safe' ? 'green' : 'red'}
                            variant="solid"
                            fontSize="xs"
                          >
                            {metalData.status}
                          </Badge>
                        </HStack>
                        
                        <SimpleGrid columns={1} gap={2}>
                          <Box textAlign="center" p={2} bg="white" rounded="sm">
                            <Text fontSize="xs" color="gray.600" mb={1}>Index Score</Text>
                            <Text fontSize="xl" fontWeight="bold" color={metalData.value > 100 ? 'red.600' : 'green.600'}>
                              {metalData.value}
                            </Text>
                          </Box>
                          
                          <SimpleGrid columns={2} gap={2}>
                            <Box textAlign="center" p={2} bg="white" rounded="sm">
                              <Text fontSize="xs" color="gray.600" mb={1}>Measured</Text>
                              <Text fontSize="sm" fontWeight="bold">
                                {metalData.concentration} mg/L
                              </Text>
                            </Box>
                            
                            <Box textAlign="center" p={2} bg="white" rounded="sm">
                              <Text fontSize="xs" color="gray.600" mb={1}>WHO Limit</Text>
                              <Text fontSize="sm" fontWeight="bold">
                                {metalKey === 'pb' ? '0.01' :
                                 metalKey === 'as' ? '0.01' :
                                 metalKey === 'cd' ? '0.003' :
                                 metalKey === 'cr' ? '0.05' :
                                 metalKey === 'ni' ? '0.07' : 'N/A'} mg/L
                              </Text>
                            </Box>
                          </SimpleGrid>
                        </SimpleGrid>
                        
                        <Box mt={2} p={2} bg={metalData.value > 100 ? 'red.50' : 'green.50'} rounded="sm">
                          <Text fontSize="xs" color={metalData.value > 100 ? 'red.700' : 'green.700'} textAlign="center">
                            {metalData.value > 100 
                              ? `⚠️ Exceeds WHO standard by ${(metalData.value - 100).toFixed(1)}%`
                              : `✅ Within safe limits (${(100 - metalData.value).toFixed(1)}% below WHO standard)`}
                          </Text>
                        </Box>
                      </Box>
                    );
                  })}
                </VStack>
                
                <Box mt={4} p={3} bg="purple.50" rounded="md">
                  <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={1}>
                    📊 Understanding Metal Index Scores:
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Index Score = (Measured Concentration ÷ WHO Standard) × 100. 
                    Scores ≤ 100 are safe, scores &gt; 100 exceed WHO drinking water standards.
                  </Text>
                </Box>
              </Box>
            )}

            {/* Regional Policy Data Section */}
            {result && (
              <Box 
                bg="white" 
                p={6} 
                rounded="lg" 
                shadow="sm" 
                w="full"
                h="fit-content"
              >
                <Heading size="md" mb={4}>🌍 Regional Water Quality Data</Heading>
                <VStack gap={4} maxH="500px" overflowY="auto">
                  {demoRegionalAnalysis.map((region, index) => {
                    const getRiskLevel = (hmpi: number) => {
                      if (hmpi <= 100) return { level: 'Safe', color: 'green', icon: '✅' };
                      if (hmpi <= 150) return { level: 'Moderate', color: 'yellow', icon: '⚠️' };
                      if (hmpi <= 200) return { level: 'High Risk', color: 'orange', icon: '🔶' };
                      return { level: 'Critical', color: 'red', icon: '⛔' };
                    };
                    
                    const risk = getRiskLevel(region.averageHMPI);
                    const recentTrend = region.trendData.length >= 2 
                      ? region.trendData[region.trendData.length - 1].hmpi - region.trendData[region.trendData.length - 2].hmpi
                      : 0;
                    
                    return (
                      <Box key={index} w="full" p={4} bg="purple.50" rounded="md" border="1px" borderColor="purple.200">
                        <VStack align="start" gap={3}>
                          <HStack justify="space-between" w="full">
                            <Text fontSize="sm" fontWeight="bold" color="purple.700">
                              {region.region}
                            </Text>
                            <Badge colorScheme={risk.color} size="sm">
                              {risk.icon} {risk.level}
                            </Badge>
                          </HStack>
                          
                          <SimpleGrid columns={2} gap={2} w="full">
                            <Box textAlign="center" p={2} bg="white" rounded="sm">
                              <Text fontSize="xs" color="gray.600" mb={1}>HMPI Score</Text>
                              <Text fontSize="lg" fontWeight="bold" color={risk.color === 'green' ? 'green.600' : risk.color === 'red' ? 'red.600' : 'orange.600'}>
                                {region.averageHMPI.toFixed(1)}
                              </Text>
                            </Box>
                            <Box textAlign="center" p={2} bg="white" rounded="sm">
                              <Text fontSize="xs" color="gray.600" mb={1}>Total Samples</Text>
                              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                                {region.totalSamples}
                              </Text>
                            </Box>
                          </SimpleGrid>
                          
                          <Box w="full" p={2} bg="white" rounded="sm">
                            <Text fontSize="xs" fontWeight="bold" mb={2} color="gray.700">Monthly Trend:</Text>
                            <HStack justify="space-between">
                              <Text fontSize="xs" color="gray.600">
                                {recentTrend > 0 ? '📈 Increasing' : recentTrend < 0 ? '📉 Decreasing' : '➡️ Stable'}
                              </Text>
                              <Text fontSize="xs" color={recentTrend > 0 ? 'red.600' : 'green.600'} fontWeight="bold">
                                {recentTrend > 0 ? '+' : ''}{recentTrend.toFixed(1)}
                              </Text>
                            </HStack>
                          </Box>
                          
                          <Box w="full" p={2} bg="white" rounded="sm">
                            <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.700">Hotspots Identified:</Text>
                            <HStack justify="space-between">
                              <Text fontSize="xs" color="gray.600">
                                {region.hotspots.length} contamination zones
                              </Text>
                              <Badge colorScheme={region.hotspots.length > 0 ? 'red' : 'green'} size="sm">
                                {region.hotspots.length > 0 ? 'Action Required' : 'Monitored'}
                              </Badge>
                            </HStack>
                          </Box>
                          
                          <Box w="full" p={2} bg={risk.color === 'green' ? 'green.50' : risk.color === 'red' ? 'red.50' : 'orange.50'} rounded="sm">
                            <Text fontSize="xs" color={risk.color === 'green' ? 'green.700' : risk.color === 'red' ? 'red.700' : 'orange.700'} textAlign="center">
                              {region.averageHMPI > 200 ? '🆘 Emergency response required' :
                               region.averageHMPI > 150 ? '🔍 Enhanced monitoring needed' :
                               region.averageHMPI > 100 ? '📊 Regular monitoring active' : 
                               '✅ Meets safety standards'}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    );
                  })}
                </VStack>
                
                <Box mt={4} p={3} bg="purple.50" rounded="md">
                  <Text fontSize="xs" color="gray.600" fontWeight="medium" mb={1}>
                    🌍 Policy Insights:
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Regional analysis data from government monitoring stations. 
                    Policy decisions are based on comprehensive water quality assessments across India.
                  </Text>
                </Box>
              </Box>
            )}

            {/* Nearby Locations Data */}
            {showNearbyData && nearbyLocations.length > 0 && (
              <Box bg="white" p={6} rounded="lg" shadow="sm">
                <Heading size="md" mb={4}>Nearby Water Quality Data</Heading>
                <VStack gap={4} maxH="500px" overflowY="auto">
                  {nearbyLocations.map((location) => (
                    <Box key={location.id} w="full" p={4} border="1px" borderColor="gray.200" rounded="lg">
                      <VStack align="start" gap={3}>
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="bold" fontSize="sm" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{location.name}</Text>
                          <Badge 
                            colorScheme={location.classification === 'Safe' ? 'green' : 
                                       location.classification === 'Moderate' ? 'yellow' : 'red'}
                            size="sm"
                          >
                            {location.classification}
                          </Badge>
                        </HStack>
                        
                        <Text fontSize="xs" color="gray.600">
                          Distance: {location.distance?.toFixed(1)} km
                        </Text>
                        
                        <SimpleGrid columns={2} gap={2} w="full">
                          <Box textAlign="center" p={2} bg="blue.50" rounded="md">
                            <Text fontSize="lg" fontWeight="bold" color="blue.600">
                              {location.averageHMPI.toFixed(1)}
                            </Text>
                            <Text fontSize="xs">HMPI</Text>
                          </Box>
                          <Box textAlign="center" p={2} bg="purple.50" rounded="md">
                            <Text fontSize="lg" fontWeight="bold" color="purple.600">
                              {location.hpi}
                            </Text>
                            <Text fontSize="xs">HPI</Text>
                          </Box>
                        </SimpleGrid>
                        
                        <Box w="full">
                          <Text fontSize="xs" fontWeight="bold" mb={1}>Metal Contamination:</Text>
                          <SimpleGrid columns={3} gap={1}>
                            {Object.entries(location.metalContamination).map(([metal, value]) => (
                              <Box key={metal} textAlign="center" p={1} bg="gray.100" rounded="sm">
                                <Text fontSize="xs" fontWeight="bold">{metal.toUpperCase()}</Text>
                                <Text fontSize="xs" color={(value as number) > 2 ? 'red.600' : (value as number) > 1 ? 'yellow.600' : 'green.600'}>
                                  {(value as number).toFixed(1)}%
                                </Text>
                              </Box>
                            ))}
                          </SimpleGrid>
                        </Box>
                        
                        <Box w="full" p={2} bg="gray.50" rounded="md">
                          <Text fontSize="xs" color="gray.600">
                            {waterQualityGuide.classifications[location.classification as 'Safe' | 'Moderate' | 'Unsafe']?.description}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}            
          </SimpleGrid>
          </Box>

        </VStack>

      </Container>
      
      {/* AI Help Assistant */}
      <AIHelpAssistant 
        themeColor="#43e97b"
        position="bottom-right"
      />
      
      {/* Report Issue Modal */}
      {isReportModalOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
          p={4}
        >
          <Box
            bg={styles.cardBackground}
            p={8}
            rounded="2xl"
            shadow={styles.shadow}
            w="full"
            maxW="500px"
            maxH="90vh"
            overflowY="auto"
            position="relative"
            border={styles.isDark ? '1px solid' : 'none'}
            borderColor={styles.borderColor}
          >
            {/* Close Button */}
            <Box
              position="absolute"
              top={4}
              right={4}
              cursor="pointer"
              onClick={() => setIsReportModalOpen(false)}
              p={2}
              rounded="md"
              _hover={{ bg: styles.isDark ? 'rgba(51, 65, 85, 0.5)' : 'gray.100' }}
            >
              <X size={20} color={styles.primaryText} />
            </Box>

            <VStack gap={6} align="start" w="full">
              {/* Header */}
              <HStack mb={2}>
                <Box
                  p={3}
                  rounded="xl"
                  bg={styles.currentGradient}
                  color="white"
                >
                  <AlertCircle size={24} />
                </Box>
                <VStack align="start" gap={1}>
                  <Heading size="lg" color={styles.primaryText}>
                    📢 Report an Issue
                  </Heading>
                  <Text fontSize="sm" color={styles.secondaryText}>
                    Help us improve water quality monitoring
                  </Text>
                </VStack>
              </HStack>

              {/* File Upload */}
              <Box w="full">
                <Text fontSize="sm" fontWeight="600" color={styles.primaryText} mb={2}>
                  📷 Upload Photo/Video
                </Text>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  bg={styles.isDark ? 'rgba(51, 65, 85, 0.5)' : 'white'}
                  borderColor={styles.isDark ? 'rgba(71, 85, 105, 0.5)' : 'gray.200'}
                  color={styles.primaryText}
                  _focus={{
                    borderColor: styles.isDark ? '#059669' : '#43e97b',
                    shadow: 'md'
                  }}
                />
                {reportData.file && (
                  <Text fontSize="xs" color={styles.secondaryText} mt={1}>
                    ✓ {reportData.file.name}
                  </Text>
                )}
              </Box>

              {/* Location */}
              <Box w="full">
                <Text fontSize="sm" fontWeight="600" color={styles.primaryText} mb={2}>
                  📍 GPS Location
                </Text>
                <VStack gap={2} w="full">
                  <HStack w="full">
                    <Input
                      value={reportData.location.latitude}
                      placeholder="Latitude"
                      readOnly
                      bg={styles.isDark ? 'rgba(51, 65, 85, 0.5)' : 'gray.50'}
                      borderColor={styles.isDark ? 'rgba(71, 85, 105, 0.5)' : 'gray.200'}
                      color={styles.primaryText}
                      size="sm"
                    />
                    <Input
                      value={reportData.location.longitude}
                      placeholder="Longitude"
                      readOnly
                      bg={styles.isDark ? 'rgba(51, 65, 85, 0.5)' : 'gray.50'}
                      borderColor={styles.isDark ? 'rgba(71, 85, 105, 0.5)' : 'gray.200'}
                      color={styles.primaryText}
                      size="sm"
                    />
                  </HStack>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={captureCurrentLocation}
                    disabled={isGettingLocation}
                    w="full"
                    borderColor={styles.isDark ? 'rgba(71, 85, 105, 0.5)' : 'gray.200'}
                    color={styles.primaryText}
                    _hover={{
                      bg: styles.isDark ? 'rgba(51, 65, 85, 0.5)' : 'gray.50'
                    }}
                  >
                    <MapPin size={16} style={{ marginRight: '4px' }} />
                    {isGettingLocation ? 'Getting Location...' : 'Update Location'}
                  </Button>
                </VStack>
              </Box>

              {/* Description */}
              <Box w="full">
                <Text fontSize="sm" fontWeight="600" color={styles.primaryText} mb={2}>
                  📝 Description
                </Text>
                <Textarea
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue e.g. foam in river, bad smell, unusual water color..."
                  rows={4}
                  bg={styles.isDark ? 'rgba(51, 65, 85, 0.5)' : 'white'}
                  borderColor={styles.isDark ? 'rgba(71, 85, 105, 0.5)' : 'gray.200'}
                  color={styles.primaryText}
                  _placeholder={{ color: styles.isDark ? 'gray.400' : 'gray.500' }}
                  _focus={{
                    borderColor: styles.isDark ? '#059669' : '#43e97b',
                    shadow: 'md'
                  }}
                />
              </Box>

              {/* Submit Button */}
              <HStack w="full" gap={3}>
                <Button
                  variant="outline"
                  onClick={() => setIsReportModalOpen(false)}
                  flex={1}
                  borderColor={styles.isDark ? 'rgba(71, 85, 105, 0.5)' : 'gray.200'}
                  color={styles.primaryText}
                  _hover={{
                    bg: styles.isDark ? 'rgba(51, 65, 85, 0.5)' : 'gray.50'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReportSubmit}
                  bg={styles.currentGradient}
                  color="white"
                  flex={2}
                  _hover={{
                    transform: 'translateY(-1px)',
                    shadow: 'md'
                  }}
                >
                  Submit Report
                </Button>
              </HStack>

              {/* Prototype Notice */}
              <Box w="full" p={3} bg={styles.isDark ? 'rgba(59, 130, 246, 0.1)' : 'blue.50'} rounded="md">
                <Text fontSize="xs" color={styles.isDark ? 'rgba(147, 197, 253, 0.8)' : 'blue.600'} textAlign="center">
                  ℹ️ This is a prototype feature. Reports will be logged to browser console only.
                </Text>
              </Box>
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CitizenInterface;