import React from 'react';

function ServiceSelector() {
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  const handleServiceSelect = (service: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(service)) {
        // Remove service if already selected
        return prev.filter((s) => s !== service);
      } else {
        // Add service if not selected
        return [...prev, service];
      }
    });
  };

  const handleNextClick = () => {
    if (selectedServices.length > 0) {
      // Navigate to service selection page with selected services
      const servicesParam = selectedServices.map(s => encodeURIComponent(s)).join(',');
      window.location.href = `/?page=garment-selection&services=${servicesParam}`;
    }
  };

  const services = [
    {
      name: "Wash & Fold",
      emoji: "👔",
      color: "#468faf",
      description: "Folded clothes",
    },
    {
      name: "Dry Clean",
      emoji: "👕",
      color: "#2a6f97",
      description: "Hanging shirts on rack",
    },
    {
      name: "Iron Only",
      emoji: "🧥",
      color: "#01497c",
      description: "Iron on board",
    },
    {
      name: "Wash + Iron",
      emoji: "👗",
      color: "#014f86",
      description: "Neat stack of clothes",
    },
  ];

  return (
    <div
      className="min-h-screen font-inter"
      style={{
        background: "linear-gradient(135deg, #f6fbfd 0%, #e8f4f8 100%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-8 py-[60px]">
        {/* Hero/Header Section */}
        <div className="text-center mb-[60px]">
          <h1
            className="text-[48px] font-bold mb-4 font-inter"
            style={{ color: "#012a4a" }}
          >
            LaundryDash Turbo
          </h1>
          <p
            className="text-[20px] font-light font-inter"
            style={{ color: "#2c7da0" }}
          >
            Fresh clothes. 20 minutes. No stress.
          </p>
        </div>

        {/* Service Tiles Grid */}
        <div className="grid grid-cols-2 gap-[30px] max-w-[740px] mx-auto mb-[60px]">
          {services.map((service, index) => {
            const isSelected = selectedServices.includes(service.name);
            return (
              <button
                key={index}
                onClick={() => handleServiceSelect(service.name)}
                className={`group relative rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg font-inter overflow-hidden bg-white ${
                  isSelected ? "ring-4 ring-blue-500 ring-opacity-50" : ""
                }`}
                style={{
                  width: "350px",
                  height: "220px",
                  transform: isSelected
                    ? "translateY(-4px)"
                    : "translateY(0px)",
                  boxShadow: isSelected
                    ? "0 8px 25px rgba(0,0,0,0.15)"
                    : undefined,
                }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}

                {/* Image Section (65% height) */}
                <div
                  className={`h-[65%] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-100 to-blue-200"
                      : ""
                  }`}
                >
                  <div className="text-7xl">{service.emoji}</div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
                </div>

                {/* Footer Section (35% height) */}
                <div
                  className="h-[35%] flex items-center justify-center"
                  style={{
                    backgroundColor: isSelected ? "#0077b6" : service.color,
                    filter: isSelected ? "brightness(1.1)" : "none",
                  }}
                >
                  <h3 className="text-lg font-bold text-white">
                    {service.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mb-[60px]">
          <p className="text-lg font-inter mb-6" style={{ color: "#2c7da0" }}>
            Let's get your laundry fresh & folded in 20 minutes.
          </p>
          <button
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg ${
              selectedServices.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            style={{
              backgroundColor:
                selectedServices.length > 0 ? "#0077b6" : "#94a3b8",
            }}
            onMouseEnter={(e) => {
              if (selectedServices.length > 0) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#0096c7";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedServices.length > 0) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#0077b6";
              }
            }}
            onClick={handleNextClick}
            disabled={selectedServices.length === 0}
          >
            Proceed
          </button>
        </div>

        {/* Selected Services Display */}
        {selectedServices.length > 0 && (
          <div className="text-center mb-[40px] transition-all duration-300 ease-in-out">
            <div className="inline-block px-8 py-4 rounded-xl bg-white shadow-sm">
              <p style={{ color: "#2c7da0" }} className="font-inter">
                Selected services:{" "}
                <span className="font-semibold" style={{ color: "#012a4a" }}>
                  {selectedServices.join(", ")}
                </span>
              </p>
            </div>
          </div>
        )}

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

export default ServiceSelector;