import React from 'react';
import { Grid, Box, Text } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from 'recharts';
import type { ProcessedData } from '../types';

interface DataVisualizationProps {
  data: ProcessedData;
}

const COLORS = {
  Safe: '#10B981',
  Moderate: '#F59E0B', 
  Unsafe: '#EF4444',
};

const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  // Prepare chart data
  const classificationData = [
    { name: 'Safe', value: data.summary.safeCount, color: COLORS.Safe },
    { name: 'Moderate', value: data.summary.moderateCount, color: COLORS.Moderate },
    { name: 'Unsafe', value: data.summary.unsafeCount, color: COLORS.Unsafe },
  ];

  const hmpiDistribution = data.results.map(result => ({
    id: result.sampleId,
    hmpi: result.hmpi,
    hpi: result.hpi,
    classification: result.classification,
  }));

  const metalContributions = data.results.length > 0 ? [
    { metal: 'Lead (Pb)', average: data.results.reduce((sum, r) => sum + r.metalContributions.pb, 0) / data.results.length },
    { metal: 'Arsenic (As)', average: data.results.reduce((sum, r) => sum + r.metalContributions.as, 0) / data.results.length },
    { metal: 'Cadmium (Cd)', average: data.results.reduce((sum, r) => sum + r.metalContributions.cd, 0) / data.results.length },
    { metal: 'Chromium (Cr)', average: data.results.reduce((sum, r) => sum + r.metalContributions.cr, 0) / data.results.length },
    { metal: 'Nickel (Ni)', average: data.results.reduce((sum, r) => sum + r.metalContributions.ni, 0) / data.results.length },
  ] : [];

  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
      {/* Classification Distribution */}
      <Box>
        <Text fontWeight="bold" mb={4} textAlign="center">
          Water Quality Classification
        </Text>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={classificationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {classificationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* HMPI vs HPI Scatter */}
      <Box>
        <Text fontWeight="bold" mb={4} textAlign="center">
          HMPI vs HPI Distribution
        </Text>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="hmpi" name="HMPI" />
            <YAxis type="number" dataKey="hpi" name="HPI" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter 
              data={hmpiDistribution} 
              fill="#3B82F6"
              name="Samples"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>

      {/* Metal Contributions */}
      <Box>
        <Text fontWeight="bold" mb={4} textAlign="center">
          Average Metal Contamination Levels
        </Text>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={metalContributions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="metal" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis label={{ value: 'Contamination %', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Contamination Level']} />
            <Bar dataKey="average" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* HMPI Distribution Histogram */}
      <Box>
        <Text fontWeight="bold" mb={4} textAlign="center">
          HMPI Score Distribution
        </Text>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hmpiDistribution.slice(0, 20)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="id" 
              angle={-45}
              textAnchor="end"
              height={60}
              fontSize={10}
            />
            <YAxis label={{ value: 'HMPI Score', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar 
              dataKey="hmpi" 
              fill="#8B5CF6"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
};

export default DataVisualization;