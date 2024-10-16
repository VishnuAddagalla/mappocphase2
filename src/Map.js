import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import styled from "styled-components";
import zipcodes from 'zipcodes';

// URL for rendering the USA map
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Styled component for the tooltip
const Tooltip = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  font-size: 12px;
  pointer-events: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const Map = ({ suppliersData, supplierColors }) => {
  const [hoveredMarker, setHoveredMarker] = useState(null); // State to track hovered marker

  // Handle hover event to update the tooltip content
  const handleMouseEnter = (event, info) => {
    const { zipCode, text, x, y } = info;
    setHoveredMarker({ zipCode, text, x, y });
  };

  const handleMouseLeave = () => {
    setHoveredMarker(null);
  };

  return (
    <div>
      {hoveredMarker && (
        <Tooltip style={{ top: hoveredMarker.y, left: hoveredMarker.x }}>
          {hoveredMarker.text}
        </Tooltip>
      )}

      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "#EAEAEC", //  gray for states
                    stroke: "#607D8B", // Dark gray for state boundaries
                    strokeWidth: 0.75,
                  },
                  hover: {
                    fill: "#CFD8DC", // Light blue
                    stroke: "#607D8B",
                    strokeWidth: 1,
                  },
                  pressed: {
                    fill: "#FF5722", // Orange
                    stroke: "#607D8B",
                    strokeWidth: 1.5,
                  },
                }}
              />
            ))
          }
        </Geographies>

        {/* Render markers and lines for the selected supplier */}
        {suppliersData.map((supplier) =>
          supplier.manufacturingSites.map((site, index) => {
            const siteLocation = zipcodes.lookup(site.zipCode); // Lookup coordinates for the manufacturing site
            if (!siteLocation) return null;

            return (
              <React.Fragment key={index}>
                {/* Manufacturing Site Marker */}
                <Marker
                  coordinates={[siteLocation.longitude, siteLocation.latitude]}
                  onMouseEnter={(e) => handleMouseEnter(e, { zipCode: site.zipCode, text: `Supplier: ${supplier.supplierId}, Zip: ${site.zipCode}`, x: e.pageX, y: e.pageY })}
                  onMouseLeave={handleMouseLeave}
                >
                  <circle r={4} fill={supplierColors[supplier.supplierId]} stroke="#fff" strokeWidth={1.5} />
                </Marker>

                {/* Render straight lines from the manufacturing site to each delivery center */}
                {site.deliveryCenters.map((deliveryZip, i) => {
                  const deliveryLocation = zipcodes.lookup(deliveryZip); // Lookup coordinates for delivery centers
                  if (!deliveryLocation) return null;

                  const start = [siteLocation.longitude, siteLocation.latitude];
                  const end = [deliveryLocation.longitude, deliveryLocation.latitude];

                  return (
                    <React.Fragment key={i}>
                      {/* Line using react-simple-maps' Line component */}
                      <Line
                        from={start}
                        to={end}
                        stroke={supplierColors[supplier.supplierId]}  // Line color matches manufacturing site
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeDasharray="5,5"
                      />
                       <Marker
                        coordinates={[deliveryLocation.longitude, deliveryLocation.latitude]}
                        onMouseEnter={(e) => handleMouseEnter(e, { zipCode: deliveryZip, text: `DC: ${deliveryZip}`, x: e.pageX, y: e.pageY })}
                        onMouseLeave={handleMouseLeave}
                      >
                        <circle r={4} fill="#0071CE" /> {/* Walmart blue */}
                      </Marker>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })
        )}
      </ComposableMap>
    </div>
  );
};

export default Map;