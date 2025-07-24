import React from 'react';

function GarmentSelection() {
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [inputMethod, setInputMethod] = React.useState("garment");
  const [garmentCounts, setGarmentCounts] = React.useState({
    shirts: 0,
    trousers: 0,
    dresses: 0,
    traditional: 0,
  });
  const [weight, setWeight] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const servicesFromURL = urlParams.get("services");
      const singleServiceFromURL = urlParams.get("service");

      if (servicesFromURL) {
        // Handle multiple services from new format
        const services = servicesFromURL
          .split(",")
          .map((s) => decodeURIComponent(s.trim()));
        setSelectedServices(services);
      } else if (singleServiceFromURL) {
        // Handle single service from old format
        setSelectedServices([decodeURIComponent(singleServiceFromURL)]);
      } else {
        // Default fallback
        setSelectedServices(["Wash & Fold"]);
      }
    }
  }, []);

  const handleBackClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const handleGarmentCountChange = (type: string, value: string | number) => {
    const numValue = Math.max(0, parseInt(value.toString()) || 0);
    setGarmentCounts((prev) => ({
      ...prev,
      [type]: numValue,
    }));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(parseFloat(e.target.value));
  };

  const garmentTypes = [
    { key: "shirts", name: "Shirts", icon: "👔" },
    { key: "trousers", name: "Trousers", icon: "👖" },
    { key: "dresses", name: "Dresses", icon: "👗" },
    { key: "traditional", name: "Traditional Clothing", icon: "🥻" },
  ];

  return (
    <div
      className="min-h-screen font-inter"
      style={{
        background: "linear-gradient(135deg, #f6fbfd 0%, #e8f4f8 100%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-8 py-[60px]">
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

        <div className="text-center mb-[60px]">
          <h1
            className="text-[42px] font-bold mb-4 font-inter"
            style={{ color: "#012a4a" }}
          >
            Selected Services: {selectedServices.join(", ")}
          </h1>

          <p
            className="text-[18px] font-light font-inter"
            style={{ color: "#2c7da0" }}
          >
            What's going in the laundry bag today?
          </p>
        </div>

        <div className="max-w-[1000px] mx-auto">
          <div className="flex justify-center mb-[50px]">
            <div className="bg-white rounded-xl p-2 shadow-sm">
              <button
                onClick={() => setInputMethod("garment")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  inputMethod === "garment"
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{
                  backgroundColor:
                    inputMethod === "garment" ? "#013a63" : "transparent",
                }}
              >
                Garment Count
              </button>
              <button
                onClick={() => setInputMethod("weight")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  inputMethod === "weight"
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{
                  backgroundColor:
                    inputMethod === "weight" ? "#013a63" : "transparent",
                }}
              >
                Weight (kg)
              </button>
            </div>
          </div>

          {inputMethod === "garment" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-[60px] max-w-[800px] mx-auto">
              {garmentTypes.map((garment) => (
                <div
                  key={garment.key}
                  className="bg-white rounded-xl p-8 shadow-sm text-center transition-all duration-300 hover:shadow-md"
                >
                  <div className="text-6xl mb-4">{garment.icon}</div>
                  <h3
                    className="text-xl font-semibold font-inter mb-6"
                    style={{ color: "#012a4a" }}
                  >
                    {garment.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() =>
                        handleGarmentCountChange(
                          garment.key,
                          garmentCounts[garment.key as keyof typeof garmentCounts] - 1,
                        )
                      }
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 hover:shadow-md"
                      style={{ backgroundColor: "#2a6f97" }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      name={`garment-${garment.key}`}
                      value={garmentCounts[garment.key as keyof typeof garmentCounts]}
                      onChange={(e) =>
                        handleGarmentCountChange(garment.key, e.target.value)
                      }
                      className="w-16 h-10 text-center border-2 rounded-lg font-semibold text-lg"
                      style={{
                        borderColor: "#e8f4f8",
                        color: "#012a4a",
                      }}
                    />
                    <button
                      onClick={() =>
                        handleGarmentCountChange(
                          garment.key,
                          garmentCounts[garment.key as keyof typeof garmentCounts] + 1,
                        )
                      }
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 hover:shadow-md"
                      style={{ backgroundColor: "#2a6f97" }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {inputMethod === "weight" && (
            <div className="bg-white rounded-xl p-8 shadow-sm mb-[60px]">
              <div className="text-center mb-8">
                <div
                  className="text-4xl font-bold mb-2 font-inter"
                  style={{ color: "#012a4a" }}
                >
                  {weight.toFixed(1)} kg
                </div>
                <p className="text-lg font-inter" style={{ color: "#2c7da0" }}>
                  Slide to select weight
                </p>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  name="weight"
                  value={weight}
                  onChange={handleWeightChange}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #2a6f97 0%, #2a6f97 ${
                      weight * 10
                    }%, #e8f4f8 ${weight * 10}%, #e8f4f8 100%)`,
                  }}
                />
                <div
                  className="flex justify-between text-sm mt-2"
                  style={{ color: "#2c7da0" }}
                >
                  <span>0 kg</span>
                  <span>5 kg</span>
                  <span>10 kg</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              className="px-12 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                backgroundColor: "#012a4a",
              }}
              onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#013a63")}
              onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#012a4a")}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GarmentSelection;