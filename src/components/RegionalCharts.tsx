import React from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { RegionalAnalysis } from '../types';

interface RegionalChartsProps {
  data: RegionalAnalysis[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const RegionalCharts: React.FC<RegionalChartsProps> = ({ data }) => {
  // Prepare data for regional comparison
  const regionalComparison = data.map(region => ({
    region: region.region,
    hmpi: region.averageHMPI,
    samples: region.totalSamples,
    hotspots: region.hotspots.length,
  }));

  // Prepare trend data (combine all regions)
  const trendData = data.length > 0 ? 
    data[0].trendData.map(trend => ({
      date: trend.date,
      ...data.reduce((acc, region) => {
        const regionTrend = region.trendData.find(t => t.date === trend.date);
        acc[region.region] = regionTrend?.hmpi || 0;
        return acc;
      }, {} as Record<string, number>)
    })) : [];

  // Sample distribution by region
  const sampleDistribution = data.map(region => ({
    name: region.region,
    value: region.totalSamples,
  }));

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
      {/* Regional HMPI Comparison */}
      <Box>
        <Text fontWeight="bold" mb={4} textAlign="center">
          Average HMPI by Region
        </Text>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={regionalComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="region" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="hmpi" 
              fill="#3B82F6"
              name="Average HMPI"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Sample Distribution */}
      <Box>
        <Text fontWeight="bold" mb={4} textAlign="center">
          Sample Distribution by Region
        </Text>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={sampleDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {sampleDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Trend Analysis */}
      {trendData.length > 0 && (
        <Box gridColumn={{ lg: '1 / -1' }}>
          <Text fontWeight="bold" mb={4} textAlign="center">
            HMPI Trend Analysis (Last 3 Months)
          </Text>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {data.map((region, index) => (
                <Line
                  key={region.region}
                  type="monotone"
                  dataKey={region.region}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={region.region}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </SimpleGrid>
  );
};

export default RegionalCharts;