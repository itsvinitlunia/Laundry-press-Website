import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Clock, 
  Package, 
  CreditCard, 
  User,
  CheckCircle,
  Circle,
  Truck,
  Calendar,
  IndianRupee,
  Star,
  MessageCircle,
  Navigation,
  Timer,
  Shirt,
  Shield
} from 'lucide-react';

function App() {
  const [currentStage, setCurrentStage] = useState(2); // Currently "Processing"

  const orderStages = [
    { 
      id: 0, 
      label: "Order Placed", 
      time: "09:30 AM", 
      color: "#64748b",
      bgColor: "#475569",
      description: "Your order has been received and is awaiting pickup"
    },
    { 
      id: 1, 
      label: "Picked Up", 
      time: "10:20 AM", 
      color: "#0891b2",
      bgColor: "#0e7490",
      description: "Your clothes have been collected from your location"
    },
    { 
      id: 2, 
      label: "Processing", 
      time: "Expected 2:00 PM", 
      color: "#0284c7",
      bgColor: "#0369a1",
      description: "Your clothes are being professionally processed"
    },
    { 
      id: 3, 
      label: "Delivered", 
      time: "Completed", 
      color: "#059669",
      bgColor: "#047857",
      description: "Your perfectly pressed clothes have been delivered!"
    }
  ];

  const IronMeter = ({ stage }: { stage: number }) => {
    const currentStageData = orderStages[stage];
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {/* Iron Meter Knob */}
          <div className="iron-meter">
            <input type="radio" id="v1" name="radio" checked={stage === 0} readOnly />
            <input type="radio" id="v2" name="radio" checked={stage === 1} readOnly />
            <input type="radio" id="v3" name="radio" checked={stage === 2} readOnly />
            <input type="radio" id="v4" name="radio" checked={stage === 3} readOnly />
            
            <label htmlFor="v1" id="l1"></label>
            <label htmlFor="v2" id="l2"></label>
            <label htmlFor="v3" id="l3"></label>
            <label htmlFor="v4" id="l4"></label>
            
            <div className="dial"></div>
            
            <div className="notches">
              <div className="notch" style={{'--n': 1} as React.CSSProperties}></div>
              <div className="notch" style={{'--n': 2} as React.CSSProperties}></div>
              <div className="notch" style={{'--n': 3} as React.CSSProperties}></div>
              <div className="notch" style={{'--n': 4} as React.CSSProperties}></div>
            </div>
            
            {/* Steam effect */}
            <div className="steam-container">
              <div className="steam steam-1"></div>
              <div className="steam steam-2"></div>
              <div className="steam steam-3"></div>
            </div>
          </div>
        </div>
        
        {/* Current status */}
        <div className="text-center">
          <div className="p-4 rounded-xl mb-2 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
            <p className="font-bold text-lg text-gray-800">{currentStageData.label}</p>
            <p className="text-sm font-semibold text-cyan-600">
              {currentStageData.time}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .iron-meter {
          display: flex;
          position: relative;
          width: 120px;
          height: 120px;
          background: conic-gradient(
              from -2deg,
              #e2e8f0,
              #cbd5e1,
              #e2e8f0,
              #cbd5e1,
              #e2e8f0
            ),
            radial-gradient(circle at 20% 20%, #f1f5f9, #e2e8f0);
          background-size: calc(100% + 8px) calc(100% + 8px);
          background-position: -4px -4px;
          border: 3px solid #cbd5e1;
          border-radius: 50%;
          box-shadow: 
            inset 0 4px 8px rgba(0,0,0,0.1),
            0 8px 16px rgba(0,0,0,0.1),
            0 0 0 1px rgba(255,255,255,0.8);
        }

        .iron-meter input {
          display: none;
          pointer-events: none;
        }

        .dial {
          position: absolute;
          width: 50px;
          height: 6px;
          border-radius: 99px;
          background: linear-gradient(90deg, #64748b, #94a3b8);
          top: calc(50% - 3px);
          left: calc(50% - 3px);
          transform-origin: 3px 50%;
          pointer-events: none;
          transition: 0.5s ease;
          box-shadow: 0 0 12px rgba(100, 116, 139, 0.3);
        }

        .iron-meter label {
          position: absolute;
          width: 100px;
          height: 100px;
          cursor: pointer;
          border-radius: 50%;
        }

        #v1:checked ~ .dial {
          transform: rotate(0deg);
          background: linear-gradient(90deg, #64748b, #94a3b8);
          box-shadow: 0 0 12px rgba(100, 116, 139, 0.3);
        }

        #v2:checked ~ .dial {
          transform: rotate(90deg);
          background: linear-gradient(90deg, #0891b2, #06b6d4);
          box-shadow: 0 0 12px rgba(8, 145, 178, 0.4);
        }

        #v3:checked ~ .dial {
          transform: rotate(180deg);
          background: linear-gradient(90deg, #0284c7, #0ea5e9);
          box-shadow: 0 0 12px rgba(2, 132, 199, 0.4);
        }

        #v4:checked ~ .dial {
          transform: rotate(270deg);
          background: linear-gradient(90deg, #059669, #10b981);
          box-shadow: 0 0 12px rgba(5, 150, 105, 0.4);
        }

        .notch {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 14px;
          height: 3px;
          background-color: #475569;
          transform: translate(-50%) rotate(calc((var(--n) - 1) * 90deg))
            translateX(50px);
          border-radius: 1.5px;
        }

        .steam-container {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .steam {
          position: absolute;
          width: 6px;
          height: 30px;
          background: linear-gradient(to top, rgba(6, 182, 212, 0.4), transparent);
          border-radius: 3px;
          animation: steam-rise 2s infinite ease-in-out;
        }

        .steam-1 {
          left: -12px;
          animation-delay: 0s;
        }

        .steam-2 {
          left: -3px;
          animation-delay: 0.5s;
        }

        .steam-3 {
          left: 6px;
          animation-delay: 1s;
        }

        #v1:checked ~ .steam-container .steam {
          animation-duration: 4s;
          opacity: 0.3;
        }

        #v2:checked ~ .steam-container .steam {
          animation-duration: 3s;
          opacity: 0.5;
          background: linear-gradient(to top, rgba(8, 145, 178, 0.5), transparent);
        }

        #v3:checked ~ .steam-container .steam {
          animation-duration: 1.5s;
          opacity: 0.8;
          background: linear-gradient(to top, rgba(2, 132, 199, 0.6), transparent);
        }

        #v4:checked ~ .steam-container .steam {
          animation-duration: 1s;
          opacity: 1;
          background: linear-gradient(to top, rgba(5, 150, 105, 0.7), transparent);
        }

        @keyframes steam-rise {
          0% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-15px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.8);
          }
        }

        .card-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .processing-shimmer {
          background: linear-gradient(90deg, 
            rgba(6, 182, 212, 0.1) 0%, 
            rgba(6, 182, 212, 0.3) 50%, 
            rgba(6, 182, 212, 0.1) 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-cyan-600 transition-colors" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Order Details</h1>
            </div>
            <div className="text-lg font-bold text-cyan-600">eastri</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Customer Profile */}
        <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
                  alt="Virat Sharma" 
                  className="w-14 h-14 rounded-full object-cover border-3 border-cyan-200"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Virat Sharma</h2>
                <div className="flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Premium Member
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-600">4.9</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Status with Iron Meter */}
        <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Order Status</h3>
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">
              <Circle className="w-3 h-3 fill-current" />
              <span>On - Time</span>
            </div>
          </div>
          
          <IronMeter stage={currentStage} />
          
          {/* Progress Timeline */}
          <div className="mt-8 space-y-3">
            {orderStages.map((stage, index) => (
              <div key={stage.id} className={`flex items-center space-x-4 p-3 rounded-lg transition-all ${
                index <= currentStage ? 'bg-cyan-50 border border-cyan-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  index < currentStage ? 'bg-green-500' : 
                  index === currentStage ? 'bg-cyan-500' : 'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <div className={`font-semibold ${
                    index <= currentStage ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {stage.label}
                  </div>
                  <div className={`text-sm ${
                    index <= currentStage ? 'text-cyan-600' : 'text-gray-400'
                  }`}>
                    {stage.time}
                  </div>
                </div>
                {index <= currentStage && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-cyan-600" />
            <span>Delivery Details</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">Pickup:</p>
                <p className="text-sm text-gray-600">Today, 10:00 AM - 11:00 AM</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">Delivery:</p>
                <p className="text-sm text-gray-600">Tomorrow, 10:00 AM - 11:00 AM</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Flat No. 12B, Lotus Residency,</p>
                  <p className="text-gray-600">Dr E Moses Road, Worli Naka,</p>
                  <p className="text-gray-600">Mumbai 400018</p>
                </div>
              </div>
              <button className="mt-3 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>Directions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5 text-cyan-600" />
            <span>Order Summary</span>
          </h3>
          
          <div className="bg-cyan-50 p-3 rounded-lg mb-4 border border-cyan-200">
            <p className="text-sm font-semibold text-cyan-700">Order ID: #123456</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Shirt className="w-5 h-5 text-cyan-600" />
                <span className="font-medium text-gray-800">Men - Shirts</span>
              </div>
              <span className="font-bold text-gray-800">2</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-cyan-600" />
                <span className="font-medium text-gray-800">Men - Trousers</span>
              </div>
              <span className="font-bold text-gray-800">5</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Shirt className="w-5 h-5 text-cyan-600" />
                <span className="font-medium text-gray-800">Women - Jeans</span>
              </div>
              <span className="font-bold text-gray-800">3</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-cyan-50 px-4 rounded-lg font-bold text-lg border border-cyan-200">
              <span className="text-gray-800">Total</span>
              <span className="text-gray-800">10 items</span>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-cyan-600" />
            <span>Payment Breakdown</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold flex items-center text-gray-800">
                <IndianRupee className="w-4 h-4" />220
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="font-semibold flex items-center text-gray-800">
                <IndianRupee className="w-4 h-4" />20
              </span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Discount</span>
              <span className="font-semibold flex items-center">
                -<IndianRupee className="w-4 h-4" />10
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-lg font-bold">
              <span className="text-gray-800">Total</span>
              <span className="flex items-center text-gray-800">
                <IndianRupee className="w-5 h-5" />230
              </span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-2xl p-6 card-shadow border border-gray-100">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Delivery Type</h4>
              <div className="bg-orange-50 text-orange-600 px-3 py-2 rounded-lg font-semibold text-center border border-orange-200">
                Express
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Payment Mode</h4>
              <div className="bg-green-50 text-green-600 px-3 py-2 rounded-lg font-semibold text-center border border-green-200">
                Cash/Online
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-cyan-600" />
              <span className="font-semibold text-cyan-700">Quality Guarantee</span>
            </div>
            <p className="text-sm text-gray-600">
              Your clothes are handled with professional care and backed by our quality guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;