import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, GeoJSON } from 'react-leaflet';
import { Icon, Layer } from 'leaflet';
import type { Feature, Geometry } from 'geojson';
import type { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapMarker } from '../types';

// Type definitions for our custom properties
interface StateProperties {
  name: string;
  density: number;
}

type StateFeature = Feature<Geometry, StateProperties>;

// India state boundaries (simplified GeoJSON data)
const indiaStates = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Delhi", "density": 145.2 },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[77.1, 28.5], [77.3, 28.5], [77.3, 28.8], [77.1, 28.8], [77.1, 28.5]]]
      }
    },
    {
      "type": "Feature", 
      "properties": { "name": "West Bengal", "density": 198.7 },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[87.5, 21.5], [89.5, 21.5], [89.5, 27.5], [87.5, 27.5], [87.5, 21.5]]]
      }
    }
  ]
};

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
interface WaterQualityMapProps {
  data: MapMarker[];
  center?: [number, number];
  zoom?: number;
  showStates?: boolean;
  height?: string;
  interactive?: boolean;
}

Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different classifications
const createCustomIcon = (classification: string) => {
  const color = classification === 'Safe' ? '#10B981' : 
               classification === 'Moderate' ? '#F59E0B' : '#EF4444';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const WaterQualityMap: React.FC<WaterQualityMapProps> = ({ 
  data, 
  center = [20.5937, 78.9629], // Center of India
  zoom = 5,
  showStates = true,
  height = '400px',
  interactive = true
}) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const getFeatureColor = (density: number) => {
    return density > 200 ? '#EF4444' :
           density > 150 ? '#F59E0B' :
           density > 100 ? '#FDE047' : '#10B981';
  };

  const onEachFeature = (feature: StateFeature, layer: Layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <div>
          <h3>${feature.properties.name}</h3>
          <p>Avg HMPI: ${feature.properties.density}</p>
          <p>Status: ${feature.properties.density > 150 ? 'High Risk' : 
                      feature.properties.density > 100 ? 'Moderate Risk' : 'Low Risk'}</p>
        </div>
      `);
      
      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          e.target.setStyle({ weight: 3, fillOpacity: 0.5 });
          setSelectedState(feature.properties.name);
        },
        mouseout: (e: LeafletMouseEvent) => {
          e.target.setStyle({ weight: 1, fillOpacity: 0.2 });
          setSelectedState(null);
        }
      });
    }
  };

  const stateStyle = (feature?: StateFeature) => {
    if (!feature || !feature.properties) {
      return {
        fillColor: '#10B981',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.2
      };
    }
    return {
      fillColor: getFeatureColor(feature.properties.density),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.2
    };
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* India State Boundaries */}
        {showStates && (
          <GeoJSON
            data={indiaStates as GeoJSON.FeatureCollection}
            style={stateStyle}
            onEachFeature={onEachFeature}
          />
        )}
        
        {/* Data markers from props */}
        {data.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createCustomIcon(marker.classification)}
          >
            <Popup>
              <div className="p-2">
                <div className="font-bold mb-1">Water Quality Report</div>
                <div className="text-sm space-y-1">
                  <div>Location: {marker.data.location || 'Unknown'}</div>
                  <div>HMPI: {marker.data.pb ? 'Calculated' : 'N/A'}</div>
                  <div className={`font-bold ${
                    marker.classification === 'Safe' ? 'text-green-600' :
                    marker.classification === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    Status: {marker.classification}
                  </div>
                  <div className="text-xs text-gray-500">
                    Sample Date: {marker.data.sampleDate?.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Add circles to show contamination radius */}
        {data.map((marker) => (
          <Circle
            key={`circle-${marker.id}`}
            center={marker.position}
            radius={marker.classification === 'Unsafe' ? 5000 : 
                   marker.classification === 'Moderate' ? 3000 : 1000}
            color={marker.classification === 'Safe' ? '#10B981' : 
                   marker.classification === 'Moderate' ? '#F59E0B' : '#EF4444'}
            fillColor={marker.classification === 'Safe' ? '#10B981' : 
                       marker.classification === 'Moderate' ? '#F59E0B' : '#EF4444'}
            fillOpacity={0.1}
            weight={1}
          />
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 0 15px rgba(0,0,0,0.2)',
        zIndex: 1000,
        fontSize: '12px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Water Quality Index</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#10B981', marginRight: '5px', borderRadius: '50%' }}></div>
          Safe (HMPI &le; 100)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#F59E0B', marginRight: '5px', borderRadius: '50%' }}></div>
          Moderate (100 &lt; HMPI &le; 200)
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#EF4444', marginRight: '5px', borderRadius: '50%' }}></div>
          Unsafe (HMPI &gt; 200)
        </div>
      </div>
      
      {/* State Info Panel */}
      {selectedState && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 0 15px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontSize: '14px',
          minWidth: '150px'
        }}>
          <div style={{ fontWeight: 'bold' }}>{selectedState}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Hover over states for details</div>
        </div>
      )}
    </div>
  );
};

export default WaterQualityMap;