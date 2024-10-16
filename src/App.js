import React, { useMemo } from "react";
import Map from "./Map"; // Assuming Map is in the same folder or adjust path as necessary
import randomColor from "randomcolor"; // Random color generation library

// Example supplier data with only zip codes
const suppliersData = [
  {
    supplierId: "SUP001",
    manufacturingSites: [
      {
        zipCode: "30301",  // Manufacturing Site (Atlanta, GA)
        deliveryCenters: ["72712", "72143", "32615"],  // Delivery Centers 
      },
    ],
  },
  {
    supplierId: "SUP001",
    manufacturingSites: [
      {
        zipCode: "13210",  // Manufacturing Site (Syracuse, NY)
        deliveryCenters: ["13403", "03077", "49036"],  // Delivery Centers 
      },
    ],
  },
  {
    supplierId: "SUP002",
    manufacturingSites: [
      {
        zipCode: "97035",  // Manufacturing Site (Portland, OR)
        deliveryCenters: ["72712", "72143", "96080"],  // Delivery Centers 
      },
    ],
  },
  {
    supplierId: "SUP002",
    manufacturingSites: [
      {
        zipCode: "85281",  // Manufacturing Site (Tempe, AZ)
        deliveryCenters: ["72712", "72143", "96080"],  // Delivery Centers 
      },
    ],
  },
  {
    supplierId: "SUP003",
    manufacturingSites: [
      {
        zipCode: "83401",  // Manufacturing Site (Idaho Falls, ID)
        deliveryCenters: ["90001", "94101"],  // Delivery Centers 
      },
    ],
  },
];

// Function to dynamically generate unique random colors for each supplier
const generateUniqueSupplierColors = (suppliersData) => {
  const colors = {};
  const usedColors = ["#0071CE"]; // Walmart Blue excluded

  suppliersData.forEach((supplier) => {
    let color;
    // Generate a random color that hasn't been used yet and is not Walmart blue
    do {
      color = randomColor({ luminosity: "dark", hue: "random" });
    } while (usedColors.includes(color));
    colors[supplier.supplierId] = color;
    usedColors.push(color); // Keeps track of used colors to avoid duplicates
  });

  return colors;
};

const App = () => {
  // Dynamically generate colors for each supplier
  const supplierColors = useMemo(() => generateUniqueSupplierColors(suppliersData), [suppliersData]);

  return (
    <div>
      <h1>Supplier-DC Map</h1>
      {/* Pass suppliersData and dynamically generated supplierColors to the Map component */}
      <Map suppliersData={suppliersData} supplierColors={supplierColors} />
    </div>
  );
};

export default App;