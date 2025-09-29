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
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { 
  TrendingUp, 
  MapPin, 
  AlertTriangle, 
  FileBarChart, 
  Building2, 
  Map, 
  Shield, 
  Download, 
  Brain, 
  DollarSign
} from 'lucide-react';
import type { RegionalAnalysis, LocationData, MapMarker } from '../types';
import { demoRegionalAnalysis, demoLocations, generateInteractiveChartData, demoSamples } from '../data/demoData';
import RegionalCharts from '../components/RegionalCharts';
import WaterQualityMap from '../components/WaterQualityMap';
import AIHelpAssistant from '../components/AIHelpAssistant';
import { useLanguage } from '../hooks/useLanguage';
import { useInterfaceStyles } from '../hooks/useInterfaceStyles';

const PolicymakerInterface: React.FC = () => {
  const { t } = useLanguage();
  const styles = useInterfaceStyles('policymaker');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('3months');
  const [regionalData] = useState<RegionalAnalysis[]>(demoRegionalAnalysis);
  const [hotspots] = useState<LocationData[]>(demoLocations.filter(loc => loc.classification !== 'Safe'));
  const [interactiveData] = useState(generateInteractiveChartData());
  const [mapMarkers] = useState<MapMarker[]>(() => {
    return demoSamples.map(sample => {
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
    });
  });

  // State for Policy Tools expanded sections
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const toggleTool = (toolName: string) => {
    setExpandedTool(expandedTool === toolName ? null : toolName);
  };

  const generateReport = async (format: 'pdf' | 'csv') => {
    setIsGeneratingReport(true);
    
    try {
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        timestamp: new Date().toISOString(),
        region: selectedRegion,
        timeRange: selectedTimeRange,
        summary: {
          totalRegions: filteredData.length,
          averageHMPI: averageHMPI.toFixed(1),
          criticalRegions,
          totalHotspots,
          totalSamples
        },
        regionalData: filteredData.map(region => ({
          region: region.region,
          totalSamples: region.totalSamples,
          averageHMPI: region.averageHMPI.toFixed(1),
          hotspots: region.hotspots.length,
          trend: region.trendData.length >= 2 
            ? (region.trendData[region.trendData.length - 1].hmpi - region.trendData[region.trendData.length - 2].hmpi).toFixed(1)
            : '0.0',
          riskLevel: region.averageHMPI <= 100 ? 'Low' :
                    region.averageHMPI <= 150 ? 'Moderate' :
                    region.averageHMPI <= 200 ? 'High' : 'Critical'
        })),
        recommendations: [
          'Implement stricter regulations in high-risk regions',
          'Expand monitoring network in under-covered areas',
          'Enhance emergency response protocols',
          'Increase public awareness programs',
          'Develop sustainable water management strategies'
        ]
      };

      if (format === 'pdf') {
        // Generate PDF report
        const pdfContent = generatePDFContent(reportData);
        downloadFile(pdfContent, `water-quality-report-${Date.now()}.pdf`);
      } else {
        // Generate CSV report
        const csvContent = generateCSVContent(reportData);
        downloadFile(csvContent, `water-quality-data-${Date.now()}.csv`);
      }
      
      alert(`${format.toUpperCase()} report generated successfully!`);
    } catch {
      alert('Error generating report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  interface ReportData {
    timestamp: string;
    region: string;
    timeRange: string;
    summary: {
      totalRegions: number;
      averageHMPI: string;
      criticalRegions: number;
      totalHotspots: number;
      totalSamples: number;
    };
    regionalData: Array<{
      region: string;
      totalSamples: number;
      averageHMPI: string;
      hotspots: number;
      trend: string;
      riskLevel: string;
    }>;
    recommendations: string[];
  }

  const generatePDFContent = (data: ReportData) => {
    // Simple PDF content simulation (in real app, use libraries like jsPDF)
    const content = `
WATER QUALITY MONITORING REPORT

Generated: ${new Date(data.timestamp).toLocaleString()}
Region Filter: ${data.region === 'all' ? 'All Regions' : data.region}
Time Range: ${data.timeRange}

SUMMARY STATISTICS:
- Total Regions Monitored: ${data.summary.totalRegions}
- Average HMPI Score: ${data.summary.averageHMPI}
- Critical Risk Regions: ${data.summary.criticalRegions}
- Total Contamination Hotspots: ${data.summary.totalHotspots}
- Total Water Samples: ${data.summary.totalSamples}

REGIONAL ANALYSIS:
${data.regionalData.map((region) => 
  `\n${region.region}:
  - Samples: ${region.totalSamples}
  - HMPI: ${region.averageHMPI}
  - Risk Level: ${region.riskLevel}
  - Hotspots: ${region.hotspots}
  - Trend: ${parseFloat(region.trend) > 0 ? '+' : ''}${region.trend}`
).join('')}

RECOMMENDATIONS:
${data.recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}

--- End of Report ---`;
    
    return new Blob([content], { type: 'application/pdf' });
  };

  const generateCSVContent = (data: ReportData) => {
    const headers = ['Region', 'Total Samples', 'Average HMPI', 'Risk Level', 'Hotspots', 'Trend'];
    const rows = data.regionalData.map((region) => [
      region.region,
      region.totalSamples,
      region.averageHMPI,
      region.riskLevel,
      region.hotspots,
      region.trend
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map((field: string | number) => `"${field}"`).join(','))
      .join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredData = selectedRegion === 'all' 
    ? regionalData 
    : regionalData.filter(data => data.region === selectedRegion);

  const totalSamples = regionalData.reduce((sum, region) => sum + region.totalSamples, 0);
  const averageHMPI = regionalData.reduce((sum, region) => sum + (region.averageHMPI * region.totalSamples), 0) / totalSamples;
  const criticalRegions = regionalData.filter(region => region.averageHMPI > 150).length;
  const totalHotspots = regionalData.reduce((sum, region) => sum + region.hotspots.length, 0);

  const getRiskLevel = (hmpi: number) => {
    if (hmpi <= 100) return { level: 'Low', color: 'green' };
    if (hmpi <= 150) return { level: 'Moderate', color: 'yellow' };
    if (hmpi <= 200) return { level: 'High', color: 'orange' };
    return { level: 'Critical', color: 'red' };
  };

  return (
    <Box minH="100vh" bg={styles.currentGradient} py={8}>
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
                {t('policymaker.title')}
              </Heading>
            </HStack>
            <Text 
              fontSize="lg" 
              color="whiteAlpha.900" 
              maxW="600px" 
              mx="auto"
              textShadow="1px 1px 2px rgba(0,0,0,0.2)"
            >
              {t('policymaker.subtitle')}
            </Text>
          </Box>

          {/* Enhanced Header Controls */}
          <Box 
            bg={styles.cardBackground} 
            p={6} 
            rounded="2xl" 
            shadow={styles.shadow} 
            w="full"
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
          <HStack justify="space-between" wrap="wrap" gap={4}>
            <HStack gap={4}>
              <Box>
                <Text fontSize="sm" mb={1} fontWeight="bold" color={styles.primaryText}>{t('policymaker.region')}</Text>
                <select 
                  value={selectedRegion} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRegion(e.target.value)}
                  style={{padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '14px', width: '200px'}}
                >
                  <option value="all">{t('policymaker.allRegions')}</option>
                  {regionalData.map(region => (
                    <option key={region.region} value={region.region}>
                      {region.region}
                    </option>
                  ))}
                </select>
              </Box>
              <Box>
                <Text fontSize="sm" mb={1} fontWeight="bold" color={styles.primaryText}>{t('policymaker.timeRange')}</Text>
                <select 
                  value={selectedTimeRange} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTimeRange(e.target.value)}
                  style={{padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '14px', width: '150px'}}
                >
                  <option value="1month">1 Month</option>
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                </select>
              </Box>
            </HStack>
            
            <HStack gap={2}>
              <Button 
                size="sm" 
                colorScheme="blue"
                onClick={() => generateReport('pdf')}
                disabled={isGeneratingReport}
              >
                <FileBarChart size={16} style={{marginRight: '8px'}} />
                {isGeneratingReport ? 'Generating...' : 'Generate Report'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => generateReport('csv')}
                disabled={isGeneratingReport}
              >
                <Map size={16} style={{marginRight: '8px'}} />
                Export CSV
              </Button>
            </HStack>
          </HStack>
        </Box>

        {/* Enhanced Key Metrics */}
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} w="full">
          <Box 
            bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" 
            p={8} 
            rounded="2xl" 
            shadow="2xl"
            textAlign="center"
            color="white"
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
            <Building2 size={40} style={{ margin: '0 auto 16px' }} />
            <Text fontSize="3xl" fontWeight="900" mb={2}>
              {filteredData.length}
            </Text>
            <Text fontSize="sm" fontWeight="600" opacity={0.9}>
              🏢 {t('policymaker.regionsMonitored')}
            </Text>
          </Box>
          
          <Box 
            bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" 
            p={8} 
            rounded="2xl" 
            shadow="2xl"
            textAlign="center"
            color="white"
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
            <TrendingUp size={40} style={{ margin: '0 auto 16px' }} />
            <Text fontSize="3xl" fontWeight="900" mb={2}>
              {averageHMPI.toFixed(1)}
            </Text>
            <Text fontSize="sm" fontWeight="600" opacity={0.9}>
              📈 {t('policymaker.averageHMPI')}
            </Text>
          </Box>
          
          <Box 
            bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" 
            p={8} 
            rounded="2xl" 
            shadow="2xl"
            textAlign="center"
            color="white"
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
            <AlertTriangle size={40} style={{ margin: '0 auto 16px' }} />
            <Text fontSize="3xl" fontWeight="900" mb={2}>
              {criticalRegions}
            </Text>
            <Text fontSize="sm" fontWeight="600" opacity={0.9}>
              ⚠️ {t('policymaker.highRiskRegions')}
            </Text>
          </Box>
          
          <Box 
            bg="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)" 
            p={8} 
            rounded="2xl" 
            shadow="2xl"
            textAlign="center"
            color="white"
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
            <MapPin size={40} style={{ margin: '0 auto 16px' }} />
            <Text fontSize="3xl" fontWeight="900" mb={2}>
              {totalHotspots}
            </Text>
            <Text fontSize="sm" fontWeight="600" opacity={0.9}>
              📍 {t('policymaker.contaminationHotspots')}
            </Text>
          </Box>
        </SimpleGrid>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} w="full">
          {/* Enhanced Regional Analysis */}
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
                📈
              </Box>
              <VStack align="start" gap={1}>
                <Heading size="lg" color="gray.800">
                  📈 Regional Trend Analysis
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Real-time water quality monitoring across regions
                </Text>
              </VStack>
            </HStack>
            <RegionalCharts data={filteredData} />
          </Box>

          {/* Enhanced Policy Tools */}
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
                🛠️
              </Box>
              <VStack align="start" gap={1}>
                <Heading size="lg" color="gray.800">
                  🛠️ Policy & Action Tools
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Evidence-based policy recommendations
                </Text>
              </VStack>
            </HStack>
            <VStack gap={4}>
              <Button 
                w="full" 
                bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                color="white"
                size="md"
                py={6}
                onClick={() => toggleTool('standards')}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'xl'
                }}
                transition="all 0.2s ease"
                fontWeight="600"
              >
                <Shield size={16} style={{marginRight: '8px'}} />
                📊 Water Quality Standards Review
              </Button>
              <Button 
                w="full" 
                bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                color="white"
                size="md"
                py={6}
                onClick={() => toggleTool('emergency')}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'xl'
                }}
                transition="all 0.2s ease"
                fontWeight="600"
              >
                <AlertTriangle size={16} style={{marginRight: '8px'}} />
                ⚠️ Emergency Response Protocol
              </Button>
              <Button 
                w="full" 
                bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                color="white"
                size="md"
                py={6}
                onClick={() => toggleTool('forecast')}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'xl'
                }}
                transition="all 0.2s ease"
                fontWeight="600"
              >
                <TrendingUp size={16} style={{marginRight: '8px'}} />
                📈 Pollution Trend Forecast
              </Button>
              <Button 
                w="full" 
                bg="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
                color="white"
                size="md"
                py={6}
                onClick={() => toggleTool('planning')}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'xl'
                }}
                transition="all 0.2s ease"
                fontWeight="600"
              >
                <MapPin size={16} style={{marginRight: '8px'}} />
                📍 Monitoring Station Planning
              </Button>
              <Button 
                w="full" 
                bg="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                color="white"
                size="md"
                py={6}
                onClick={() => toggleTool('recommendations')}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'xl'
                }}
                transition="all 0.2s ease"
                fontWeight="600"
              >
                <Brain size={16} style={{marginRight: '8px'}} />
                💡 Smart Recommendations
              </Button>
            </VStack>
          </Box>
        </Grid>

        {/* National Water Quality Map */}
        <Box bg="white" p={6} rounded="lg" shadow="sm" w="full" mt={8}>
          <Heading size="md" mb={4}>National Water Quality Monitoring Map</Heading>
          <Box 
            h="500px" 
            border="1px" 
            borderColor="gray.200" 
            rounded="lg" 
            overflow="hidden"
            position="relative"
            zIndex={1}
          >
            <WaterQualityMap 
              data={mapMarkers}
              center={[20.5937, 78.9629]} // Center of India
              zoom={5}
              height="500px"
              interactive={true}
              showStates={true}
            />
          </Box>
          <Box mt={4} p={3} bg="gray.50" rounded="lg">
            <Text fontSize="sm" fontWeight="bold" mb={2}>Map Features:</Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <Text fontSize="xs">• State-wise contamination levels</Text>
              <Text fontSize="xs">• Real-time monitoring stations</Text>
              <Text fontSize="xs">• Historical trend analysis</Text>
              <Text fontSize="xs">• Risk zone identification</Text>
              <Text fontSize="xs">• Population impact assessment</Text>
              <Text fontSize="xs">• Emergency response zones</Text>
            </SimpleGrid>
          </Box>
        </Box>

        {/* Regional Details Table */}
        <Box bg="white" p={6} rounded="lg" shadow="sm" w="full">
          <Heading size="md" mb={4}>Regional Water Quality Overview</Heading>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', fontSize: '14px', borderCollapse: 'collapse'}}>
              <thead style={{backgroundColor: '#f7fafc'}}>
                <tr>
                  <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Region</th>
                  <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Total Samples</th>
                  <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Average HMPI</th>
                  <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Risk Level</th>
                  <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Trend</th>
                  <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Hotspots</th>
                  <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e2e8f0'}}>Action Required</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((region) => {
                  const risk = getRiskLevel(region.averageHMPI);
                  const recentTrend = region.trendData.length >= 2 
                    ? region.trendData[region.trendData.length - 1].hmpi - region.trendData[region.trendData.length - 2].hmpi
                    : 0;
                  
                  return (
                    <tr key={region.region} style={{borderBottom: '1px solid #e2e8f0'}}>
                      <td style={{padding: '8px', fontWeight: 'bold'}}>{region.region}</td>
                      <td style={{padding: '8px'}}>{region.totalSamples}</td>
                      <td style={{padding: '8px'}}>
                        <span style={{fontWeight: 'bold'}}>{region.averageHMPI.toFixed(1)}</span>
                      </td>
                      <td style={{padding: '8px'}}>
                        <Badge colorScheme={risk.color}>
                          {risk.level}
                        </Badge>
                      </td>
                      <td style={{padding: '8px'}}>
                        <HStack>
                          {recentTrend > 0 ? (
                            <TrendingUp size={16} className="text-red-500" />
                          ) : (
                            <TrendingUp size={16} className="text-green-500 rotate-180" />
                          )}
                          <Text fontSize="sm" color={recentTrend > 0 ? 'red.500' : 'green.500'}>
                            {Math.abs(recentTrend).toFixed(1)}
                          </Text>
                        </HStack>
                      </td>
                      <td style={{padding: '8px'}}>
                        <Badge colorScheme={region.hotspots.length > 0 ? 'red' : 'green'}>
                          {region.hotspots.length}
                        </Badge>
                      </td>
                      <td style={{padding: '8px'}}>
                        <Text fontSize="xs" maxW="120px">
                          {region.averageHMPI > 200 ? 'Emergency response' :
                           region.averageHMPI > 150 ? 'Enhanced monitoring' :
                           region.averageHMPI > 100 ? 'Regular monitoring' : 
                           'Maintain standards'}
                        </Text>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Box>

        {/* Hotspot Mapping */}
        {hotspots.length > 0 && (
          <Box bg="white" p={6} rounded="lg" shadow="sm" w="full">
            <HStack mb={4}>
              <AlertTriangle className="text-red-500" size={20} />
              <Heading size="md">Contamination Hotspots</Heading>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {hotspots.map((hotspot) => (
                <Box key={hotspot.id} p={4} border="1px" borderColor="gray.200" rounded="lg">
                  <VStack align="start" gap={2}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold" fontSize="sm">{hotspot.name}</Text>
                      <Badge 
                        colorScheme={hotspot.classification === 'Moderate' ? 'yellow' : 'red'}
                        size="sm"
                      >
                        {hotspot.classification}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">{hotspot.region}</Text>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="xs">HMPI: {hotspot.averageHMPI.toFixed(1)}</Text>
                      <Text fontSize="xs">{hotspot.samples.length} samples</Text>
                    </HStack>
                    <div style={{width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden'}}>
                      <div 
                        style={{
                          width: `${Math.min((hotspot.averageHMPI / 300) * 100, 100)}%`, 
                          height: '100%', 
                          backgroundColor: hotspot.classification === 'Moderate' ? '#d69e2e' : '#e53e3e', 
                          transition: 'width 0.3s ease'
                        }} 
                      />
                    </div>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Interactive Metal Contamination Analysis */}
        <Box bg="white" p={6} rounded="lg" shadow="sm" w="full">
          <Heading size="md" mb={4}>Heavy Metal Contamination Analysis</Heading>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            <Box>
              <Text fontWeight="bold" mb={3} textAlign="center">Metal Contamination vs WHO Limits</Text>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={interactiveData.metalDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metal" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis label={{ value: 'Contamination %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]} />
                  <Bar dataKey="contamination" fill="#3B82F6" name="Current Level" />
                  <Bar dataKey="limit" fill="#EF4444" name="WHO Limit" opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            
            <Box>
              <Text fontWeight="bold" mb={3} textAlign="center">Risk Distribution by Region</Text>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={interactiveData.riskAssessment.slice(0, 3)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis label={{ value: 'Samples %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="lowRisk" stackId="risk" fill="#10B981" name="Low Risk" />
                  <Bar dataKey="mediumRisk" stackId="risk" fill="#F59E0B" name="Medium Risk" />
                  <Bar dataKey="highRisk" stackId="risk" fill="#F97316" name="High Risk" />
                  <Bar dataKey="criticalRisk" stackId="risk" fill="#EF4444" name="Critical Risk" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Box>

        {/* Trend Analysis Chart */}
        <Box bg="white" p={6} rounded="lg" shadow="sm" w="full">
          <Heading size="md" mb={4}>HMPI Trend Analysis - Last 6 Months</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={interactiveData.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'HMPI Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="Delhi NCR" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Mumbai Metropolitan" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="West Bengal" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Tamil Nadu" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Karnataka" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Policy Tools Expanded Content Sections */}
        {expandedTool && (
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
              bgGradient: expandedTool === 'standards' ? 'linear(to-r, #4facfe, #00f2fe)' :
                          expandedTool === 'emergency' ? 'linear(to-r, #fa709a, #fee140)' :
                          expandedTool === 'forecast' ? 'linear(to-r, #43e97b, #38f9d7)' :
                          expandedTool === 'planning' ? 'linear(to-r, #8b5cf6, #a78bfa)' :
                          'linear(to-r, #fbbf24, #f59e0b)'
            }}
          >
            <HStack justify="space-between" mb={6}>
              <Heading size="lg" color="gray.800">
                {expandedTool === 'standards' ? '📊 Water Quality Standards Review' :
                 expandedTool === 'emergency' ? '⚠️ Emergency Response Protocol' :
                 expandedTool === 'forecast' ? '📈 Pollution Trend Forecast' :
                 expandedTool === 'planning' ? '📍 Monitoring Station Planning' :
                 '💡 Smart Recommendations'}
              </Heading>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setExpandedTool(null)}
              >
                ✕ Close
              </Button>
            </HStack>

            {/* Smart Recommendations */}
            {expandedTool === 'recommendations' && (
              <VStack gap={6} align="start">
                <Text fontSize="md" color="gray.700">
                  AI-generated policy recommendations based on real-time water quality data and contamination patterns.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="full">
                  <Box p={6} bg="yellow.50" rounded="xl" border="2px" borderColor="yellow.200">
                    <HStack mb={4}>
                      <Brain size={24} color="#d69e2e" />
                      <Heading size="md" color="yellow.700">Priority Recommendations</Heading>
                    </HStack>
                    <VStack gap={3} align="start">
                      <Box p={3} bg="white" rounded="lg" w="full">
                        <Text fontSize="sm" fontWeight="bold" color="red.700" mb={1}>Immediate Action Required</Text>
                        <Text fontSize="xs" color="gray.600">Implement stricter regulations in West Bengal arsenic hotspots</Text>
                        <Text fontSize="xs" color="blue.600">Cost: ₹8.5 Cr | Impact: 2.4M people</Text>
                      </Box>
                      <Box p={3} bg="white" rounded="lg" w="full">
                        <Text fontSize="sm" fontWeight="bold" color="orange.700" mb={1}>High Priority</Text>
                        <Text fontSize="xs" color="gray.600">Expand groundwater recharge programs in Gujarat</Text>
                        <Text fontSize="xs" color="blue.600">Cost: ₹15.2 Cr | Impact: 1.8M people</Text>
                      </Box>
                      <Box p={3} bg="white" rounded="lg" w="full">
                        <Text fontSize="sm" fontWeight="bold" color="yellow.700" mb={1}>Medium Priority</Text>
                        <Text fontSize="xs" color="gray.600">Enhance monitoring network in industrial corridors</Text>
                        <Text fontSize="xs" color="blue.600">Cost: ₹12.8 Cr | Impact: 3.1M people</Text>
                      </Box>
                    </VStack>
                  </Box>

                  <Box p={6} bg="green.50" rounded="xl" border="2px" borderColor="green.200">
                    <HStack mb={4}>
                      <DollarSign size={24} color="#38a169" />
                      <Heading size="md" color="green.700">Cost-Benefit Analysis</Heading>
                    </HStack>
                    <VStack gap={3} align="start">
                      <Box p={3} bg="white" rounded="lg" w="full">
                        <Text fontSize="sm" fontWeight="bold" color="green.700" mb={1}>Treatment Plants</Text>
                        <Text fontSize="xs" color="gray.600">ROI: 2.8x over 10 years</Text>
                        <Text fontSize="xs" color="gray.600">Health cost savings: ₹850 Cr</Text>
                      </Box>
                      <Box p={3} bg="white" rounded="lg" w="full">
                        <Text fontSize="sm" fontWeight="bold" color="green.700" mb={1}>Prevention Programs</Text>
                        <Text fontSize="xs" color="gray.600">ROI: 4.2x over 5 years</Text>
                        <Text fontSize="xs" color="gray.600">Environmental impact: 65% reduction</Text>
                      </Box>
                      <Box p={3} bg="white" rounded="lg" w="full">
                        <Text fontSize="sm" fontWeight="bold" color="green.700" mb={1}>Monitoring Network</Text>
                        <Text fontSize="xs" color="gray.600">ROI: 3.5x over 8 years</Text>
                        <Text fontSize="xs" color="gray.600">Early detection: 89% improvement</Text>
                      </Box>
                    </VStack>
                  </Box>
                </SimpleGrid>

                <Box w="full" p={6} bg="blue.50" rounded="xl" border="2px" borderColor="blue.200">
                  <HStack justify="space-between" mb={4}>
                    <Heading size="md" color="blue.700">🎯 Implementation Roadmap</Heading>
                    <Button size="sm" colorScheme="blue" variant="outline">
                      <Download size={16} style={{marginRight: '8px'}} />
                      Export Plan
                    </Button>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    <Box p={4} bg="white" rounded="lg">
                      <Text fontSize="sm" fontWeight="bold" color="blue.700" mb={2}>Short-term (0-6 months)</Text>
                      <Text fontSize="xs" color="gray.600">• Emergency response protocols</Text>
                      <Text fontSize="xs" color="gray.600">• Immediate hotspot treatment</Text>
                      <Text fontSize="xs" color="gray.600">• Community awareness programs</Text>
                    </Box>
                    <Box p={4} bg="white" rounded="lg">
                      <Text fontSize="sm" fontWeight="bold" color="blue.700" mb={2}>Medium-term (6-18 months)</Text>
                      <Text fontSize="xs" color="gray.600">• Infrastructure development</Text>
                      <Text fontSize="xs" color="gray.600">• Regulatory framework updates</Text>
                      <Text fontSize="xs" color="gray.600">• Technology deployment</Text>
                    </Box>
                    <Box p={4} bg="white" rounded="lg">
                      <Text fontSize="sm" fontWeight="bold" color="blue.700" mb={2}>Long-term (18+ months)</Text>
                      <Text fontSize="xs" color="gray.600">• Sustainable water management</Text>
                      <Text fontSize="xs" color="gray.600">• Policy impact assessment</Text>
                      <Text fontSize="xs" color="gray.600">• National standards review</Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              </VStack>
            )}

            {/* Other tool contents would go here following the same pattern */}
          </Box>
        )}
      </VStack>
      </Container>
      
      {/* AI Help Assistant */}
      <Box position="fixed" bottom={4} right={4} zIndex={1000}>
        <AIHelpAssistant 
          themeColor="#667eea"
          position="bottom-right"
        />
      </Box>
    </Box>
  );
};

export default PolicymakerInterface;