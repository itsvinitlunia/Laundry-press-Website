import React from 'react';
import ServiceSelector from './components/ServiceSelector';
import GarmentSelection from './components/GarmentSelection';
import ClothingInput from './components/ClothingInput';

function App() {
  const [currentPage, setCurrentPage] = React.useState('service-selector');

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get("page");
      
      if (page === "garment-selection") {
        setCurrentPage('garment-selection');
      } else if (page === "clothing-input") {
        setCurrentPage('clothing-input');
      } else {
        setCurrentPage('service-selector');
      }
    }
  }, []);

  if (currentPage === 'garment-selection') {
    return <GarmentSelection />;
  }
  
  if (currentPage === 'clothing-input') {
    return <ClothingInput />;
  }

  return <ServiceSelector />;
}

export default App;