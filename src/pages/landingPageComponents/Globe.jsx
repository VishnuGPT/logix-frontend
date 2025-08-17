import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeIndia() {
  const [hexData, setHexData] = useState([]);
  const globeRef = useRef();

  // Your theme colors (replace with actual hex codes from your theme)
  // This helps keep the component's color dependencies clear.
  const themeColors = {
    interactive: '#3e92cc',
    accentHighlight: '#EEE8A9',
    headings: '#0a2463',
  };

  useEffect(() => {
    // Load India GeoJSON data
    fetch('/data/india-geo.json')
      .then((res) => res.json())
      .then((data) => setHexData(data.features))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Focus camera on India once data is loaded
    if (hexData.length > 0 && globeRef.current) {
      globeRef.current.pointOfView(
        { lat: 22.5937, lng: 78.9629, altitude: 1.5 },
        1500 // Animation duration in ms
      );
    }
  }, [hexData]);

  return (
    // UPDATED: Container is now responsive and uses a subtle glow for a modern feel.
    <div className="w-full max-w-xl aspect-square flex justify-center items-center rounded-full">
      <Globe
        ref={globeRef}
        // UPDATED: Using a more stylized, minimalist globe texture.
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        // Data for the highlighted region (India)
        hexPolygonsData={hexData}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        // UPDATED: Using our theme's accent color for the polygons.
        hexPolygonColor={() => themeColors.accentHighlight}
        // Atmosphere settings
        showAtmosphere={true}
        // UPDATED: Atmosphere color now uses our theme's interactive blue.
        atmosphereColor={themeColors.interactive}
        atmosphereAltitude={0.15}
        // Set a transparent background for the globe canvas
        backgroundColor="rgba(0,0,0,0)"
        // Define the size of the globe canvas
        width={600}
        height={600}
      />
    </div>
  );
}