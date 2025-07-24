import React from 'react';

interface ClothingItem {
  type: string;
  quantity: number;
  price: number;
}

interface ServiceItems {
  [serviceName: string]: ClothingItem[];
}

function ClothingInput() {
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [serviceItems, setServiceItems] = React.useState<ServiceItems>({});
  const [currentSelections, setCurrentSelections] = React.useState<{[key: string]: {type: string, quantity: number}}>({});

  // Pricing table with exact rates
  const pricingTable = {
    'Shirt': {
      'Wash & Fold': 20,
      'Iron Only': 15,
      'Dry Clean': 120,
      'Wash + Iron': 40
    },
    'Trouser': {
      'Wash & Fold': 25,
      'Iron Only': 20,
      'Dry Clean': 130,
      'Wash + Iron': 50
    },
    'Dress': {
      'Wash & Fold': 30,
      'Iron Only': 30,
      'Dry Clean': 150,
      'Wash + Iron': 70
    },
    'Traditional': {
      'Wash & Fold': 35,
      'Iron Only': 30,
      'Dry Clean': 180,
      'Wash + Iron': 80
    }
  };

  const clothingOptions = ['Shirt', 'Trouser', 'Dress', 'Traditional'];

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const servicesFromURL = urlParams.get("services");
      
      if (servicesFromURL) {
        const services = servicesFromURL
          .split(",")
          .map((s) => decodeURIComponent(s.trim()));
        setSelectedServices(services);
        
        // Initialize service items and current selections
        const initialServiceItems: ServiceItems = {};
        const initialCurrentSelections: {[key: string]: {type: string, quantity: number}} = {};
        
        services.forEach(service => {
          initialServiceItems[service] = [];
          initialCurrentSelections[service] = { type: 'Shirt', quantity: 1 };
        });
        
        setServiceItems(initialServiceItems);
        setCurrentSelections(initialCurrentSelections);
      } else {
        // Default fallback
        setSelectedServices(['Wash & Fold']);
        setServiceItems({ 'Wash & Fold': [] });
        setCurrentSelections({ 'Wash & Fold': { type: 'Shirt', quantity: 1 } });
      }
    }
  }, []);

  const handleBackClick = () => {
    if (typeof window !== "undefined") {
      const servicesParam = selectedServices.map(s => encodeURIComponent(s)).join(',');
      window.location.href = `/?page=garment-selection&services=${servicesParam}`;
    }
  };

  const handleClothingTypeChange = (service: string, type: string) => {
    setCurrentSelections(prev => ({
      ...prev,
      [service]: { ...prev[service], type }
    }));
  };

  const handleQuantityChange = (service: string, quantity: number) => {
    const validQuantity = Math.max(1, quantity);
    setCurrentSelections(prev => ({
      ...prev,
      [service]: { ...prev[service], quantity: validQuantity }
    }));
  };

  const addClothingItem = (service: string) => {
    const selection = currentSelections[service];
    if (!selection) return;

    const price = pricingTable[selection.type as keyof typeof pricingTable][service as keyof typeof pricingTable['Shirt']];
    const totalPrice = price * selection.quantity;

    const newItem: ClothingItem = {
      type: selection.type,
      quantity: selection.quantity,
      price: totalPrice
    };

    setServiceItems(prev => ({
      ...prev,
      [service]: [...prev[service], newItem]
    }));

    // Reset current selection
    setCurrentSelections(prev => ({
      ...prev,
      [service]: { type: 'Shirt', quantity: 1 }
    }));
  };

  const removeClothingItem = (service: string, index: number) => {
    setServiceItems(prev => ({
      ...prev,
      [service]: prev[service].filter((_, i) => i !== index)
    }));
  };

  const getServiceTotal = (service: string) => {
    return serviceItems[service]?.reduce((total, item) => total + item.price, 0) || 0;
  };

  const getGrandTotal = () => {
    return selectedServices.reduce((total, service) => total + getServiceTotal(service), 0);
  };

  const getServiceColor = (service: string) => {
    const colors = {
      'Wash & Fold': '#468faf',
      'Dry Clean': '#2a6f97',
      'Iron Only': '#01497c',
      'Wash + Iron': '#014f86'
    };
    return colors[service as keyof typeof colors] || '#468faf';
  };

  return (
    <div
      className="min-h-screen font-inter"
      style={{
        background: "linear-gradient(135deg, #f6fbfd 0%, #e8f4f8 100%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-8 py-[60px]">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-90"
            style={{
              backgroundColor: "transparent",
              color: "#01497c",
              border: `2px solid #01497c`,
            }}
          >
            <span className="text-lg">←</span>
            <span className="font-semibold">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-[60px]">
          <h1
            className="text-[42px] font-bold mb-4 font-inter"
            style={{ color: "#012a4a" }}
          >
            Add Your Clothing Items
          </h1>
          <p
            className="text-[18px] font-light font-inter"
            style={{ color: "#2c7da0" }}
          >
            Select clothing items for each service
          </p>
        </div>

        {/* Service Sections */}
        <div className="space-y-8 mb-[60px]">
          {selectedServices.map((service) => (
            <div
              key={service}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Service Header */}
              <div
                className="px-8 py-6 text-white"
                style={{ backgroundColor: getServiceColor(service) }}
              >
                <h2 className="text-2xl font-bold font-inter">{service}</h2>
                <p className="text-lg opacity-90">
                  Total: ₹{getServiceTotal(service)}
                </p>
              </div>

              {/* Input Section */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "#012a4a" }}>
                      Clothing Type
                    </label>
                    <select
                      value={currentSelections[service]?.type || 'Shirt'}
                      onChange={(e) => handleClothingTypeChange(service, e.target.value)}
                      className="w-full px-4 py-3 border-2 rounded-lg font-semibold"
                      style={{
                        borderColor: "#e8f4f8",
                        color: "#012a4a",
                      }}
                    >
                      {clothingOptions.map((option) => (
                        <option key={option} value={option}>
                          {option === 'Traditional' ? 'Traditional (Kurta, Saree, etc.)' : option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "#012a4a" }}>
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={currentSelections[service]?.quantity || 1}
                      onChange={(e) => handleQuantityChange(service, parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border-2 rounded-lg font-semibold text-center"
                      style={{
                        borderColor: "#e8f4f8",
                        color: "#012a4a",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: "#012a4a" }}>
                      Price per item
                    </label>
                    <div
                      className="px-4 py-3 border-2 rounded-lg font-bold text-center"
                      style={{
                        borderColor: "#e8f4f8",
                        color: "#012a4a",
                        backgroundColor: "#f8fafc"
                      }}
                    >
                      ₹{currentSelections[service] ? 
                        pricingTable[currentSelections[service].type as keyof typeof pricingTable][service as keyof typeof pricingTable['Shirt']] : 0}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => addClothingItem(service)}
                      className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      style={{ backgroundColor: getServiceColor(service) }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.filter = "brightness(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.filter = "brightness(1)";
                      }}
                    >
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Added Items List */}
                {serviceItems[service] && serviceItems[service].length > 0 && (
                  <div className="border-t-2 pt-6" style={{ borderColor: "#e8f4f8" }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: "#012a4a" }}>
                      Added Items:
                    </h3>
                    <div className="space-y-3">
                      {serviceItems[service].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg"
                          style={{ backgroundColor: "#f8fafc" }}
                        >
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold" style={{ color: "#012a4a" }}>
                              {item.type === 'Traditional' ? 'Traditional (Kurta, Saree, etc.)' : item.type}
                            </span>
                            <span className="text-gray-600">×{item.quantity}</span>
                            <span className="font-bold" style={{ color: getServiceColor(service) }}>
                              ₹{item.price}
                            </span>
                          </div>
                          <button
                            onClick={() => removeClothingItem(service, index)}
                            className="px-3 py-1 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total and Continue */}
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <div className="mb-6">
            <h2
              className="text-3xl font-bold mb-2 font-inter"
              style={{ color: "#012a4a" }}
            >
              Grand Total: ₹{getGrandTotal()}
            </h2>
            <p className="text-lg" style={{ color: "#2c7da0" }}>
              Total items across all services
            </p>
          </div>

          <button
            className={`px-12 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              getGrandTotal() === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{
              backgroundColor: getGrandTotal() > 0 ? "#012a4a" : "#94a3b8",
            }}
            onMouseEnter={(e) => {
              if (getGrandTotal() > 0) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#013a63";
              }
            }}
            onMouseLeave={(e) => {
              if (getGrandTotal() > 0) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#012a4a";
              }
            }}
            disabled={getGrandTotal() === 0}
          >
            Proceed to Checkout
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-[80px]">
          <p className="text-sm font-inter" style={{ color: "#90e0ef" }}>
            LaundryDash Turbo © 2025
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClothingInput;