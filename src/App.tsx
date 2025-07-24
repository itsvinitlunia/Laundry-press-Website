import React, { useState } from "react";
import {
  Shirt,
  Zap,
  Package,
  MapPin,
  User,
  Lock,
  Phone,
  Home,
  Clock,
  Star,
  Car,
  CheckCircle,
  MessageSquare,
  Mail,
  Hash,
  Building,
} from "lucide-react";

interface UserData {
  phone: string;
  otp: string;
  name: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  building: string;
  street: string;
  aadhaar?: string;
  bankAccount?: string;
  ifsc?: string;
  services: ('washing' | 'ironing' | 'both' | 'drycleaning')[];
  clothCounts: {
    washing: number;
    ironing: number;
    both: number;
    drycleaning: number;
  };
  pickupTime: 'scheduled' | 'instant';
  scheduledDate: string;
  scheduledTime: string;
  expressServices: {
    washing: boolean;
    ironing: boolean;
    both: boolean;
    drycleaning: boolean;
  };
}

interface ServiceOption {
  id: 'washing' | 'ironing' | 'both' | 'drycleaning';
  name: string;
  price: number;
  description: string;
  icon: React.ReactNode;
  image: string;
}

interface DriverInfo {
  name: string;
  rating: number;
  phone: string;
  vehicle: string;
  plateNumber: string;
  estimatedTime: string;
  photo: string;
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'washing',
    name: 'Washing Only',
    price: 2,
    description: 'Professional washing with premium detergents',
    icon: <Shirt className="w-8 h-8" />,
    image: '/images/wash.jpeg'
  },
  {
    id: 'ironing',
    name: 'Ironing Only',
    price: 1.5,
    description: 'Expert ironing for crisp, wrinkle-free clothes',
    icon: <Zap className="w-8 h-8" />,
    image: '/images/iron only.png'
  },
  {
    id: 'both',
    name: 'Wash & Iron',
    price: 3,
    description: 'Complete service - washing + ironing',
    icon: <Package className="w-8 h-8" />,
    image: '/images/iron and wash.jpeg'
  },
  {
    id: 'drycleaning',
    name: 'Dry Cleaning',
    price: 4,
    description: 'Premium dry cleaning for delicate and special fabrics',
    icon: <Lock className="w-8 h-8" />,
    image: '/images/dryclean.jpeg'
  }
];

const driverInfo: DriverInfo = {
  name: 'Michael Johnson',
  rating: 4.8,
  phone: '+1 (555) 123-4567',
  vehicle: 'Honda Civic',
  plateNumber: 'ABC-123',
  estimatedTime: '15-20 minutes',
  photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200'
};

function App() {
  const [currentStep, setCurrentStep] = useState<'auth' | 'otp' | 'details' | 'service' | 'confirmation' | 'tracking' | 'driverDashboard'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loginType, setLoginType] = useState<'user' | 'driver'>('user');
  const [userData, setUserData] = useState<UserData>({
    phone: '',
    otp: '',
    name: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    building: '',
    street: '',
    aadhaar: '',
    bankAccount: '',
    ifsc: '',
    services: [],
    clothCounts: {
      washing: 0,
      ironing: 0,
      both: 0,
      drycleaning: 0
    },
    pickupTime: 'scheduled',
    scheduledDate: '',
    scheduledTime: '',
    expressServices: {
      washing: false,
      ironing: false,
      both: false,
      drycleaning: false
    }
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Start countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOTP = () => {
    // Simulate OTP sending
    setOtpSent(true);
    setCountdown(30);
    // In real app, you would call your OTP service here
    console.log(`Sending OTP to ${userData.phone}`);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.phone.length === 10) {
      sendOTP();
      setCurrentStep('otp');
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  const handleOTPVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate OTP verification (in real app, verify with backend)
    if (userData.otp === '1234' || userData.otp.length === 4) {
        setCurrentStep('details');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === 'driver') {
      setCurrentStep('driverDashboard');
    } else {
    setCurrentStep('service');
    }
  };

  const handleServiceToggle = (serviceId: 'washing' | 'ironing' | 'both' | 'drycleaning') => {
    setUserData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleContinueToConfirmation = () => {
    if (userData.services.length > 0) {
      setCurrentStep('confirmation');
    }
  };

  const handleConfirmOrder = () => {
    setCurrentStep('tracking');
  };

  const getSelectedServices = () => {
    return serviceOptions.filter(service => userData.services.includes(service.id));
  };

  const getTotalPrice = () => {
    const selectedServices = getSelectedServices();
    const baseTotal = selectedServices.reduce((total, service) => {
      const count = userData.clothCounts[service.id];
      return total + (service.price * count);
    }, 0);
    
    // Add express service charges
    let expressCharges = 0;
    if (userData.pickupTime === 'instant') {
      selectedServices.forEach(service => {
        if (userData.expressServices[service.id]) {
          const count = userData.clothCounts[service.id];
          if (service.id === 'ironing') {
            expressCharges += count * 1; // $1 extra per item for 1-hour ironing
          } else if (service.id === 'washing') {
            expressCharges += count * 0.5; // $0.5 extra per item for 1-day washing
          } else if (service.id === 'both') {
            expressCharges += count * 1.5; // $1.5 extra per item for express combo
          } else if (service.id === 'drycleaning') {
            expressCharges += count * 2; // $2 extra per item for express dry cleaning
          }
        }
      });
    }
    
    return baseTotal + expressCharges;
  };

  if (currentStep === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shirt className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">LaundryGo</h1>
            <p className="text-gray-600">Professional laundry service at your doorstep</p>
          </div>

          {/* Login type toggle */}
          <div className="flex mb-4 justify-center gap-2">
            <button
              onClick={() => setLoginType('user')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                loginType === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              User Login
            </button>
            <button
              onClick={() => setLoginType('driver')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                loginType === 'driver'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Driver Login
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                disabled={loginType === 'driver'}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ml-2 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                disabled={loginType === 'driver'}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {loginType === 'driver' ? 'Driver Phone Number' : 'Phone Number'}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 flex items-center">
                    <span className="text-gray-500 text-sm mr-1">+91</span>
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder={loginType === 'driver' ? 'Enter driver mobile number' : 'Enter 10-digit mobile number'}
                    value={userData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setUserData(prev => ({ ...prev, phone: value }));
                    }}
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                    required
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send you an OTP to verify your number
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Send OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">Verify OTP</h1>
            <p className="text-gray-600">We've sent a 4-digit code to</p>
            <p className="font-semibold text-gray-800">+91 {userData.phone}</p>
            <div className="mt-4">
              <img 
                src="https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300" 
                alt="Phone verification" 
                className="w-32 h-24 object-cover rounded-lg mx-auto shadow-md"
              />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleOTPVerification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={userData.otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setUserData(prev => ({ ...prev, otp: value }));
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm text-center text-lg font-mono tracking-widest"
                    required
                    maxLength={4}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  For demo purposes, use OTP: 1234
                </p>
              </div>

              <button
                type="submit"
                disabled={userData.otp.length !== 4}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                  userData.otp.length === 4
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-700 hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Verify OTP
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in {countdown} seconds
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={sendOTP}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setCurrentStep('auth');
                  setOtpSent(false);
                  setCountdown(0);
                  setUserData(prev => ({ ...prev, otp: '' }));
                }}
                className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                ← Change Phone Number
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">Personal Details</h2>
            <p className="text-gray-600">{loginType === 'driver' ? 'Complete your profile to start accepting orders' : 'Help us serve you better'}</p>
            <div className="mt-4">
              <img 
                src="https://images.pexels.com/photos/5591659/pexels-photo-5591659.jpeg?auto=compress&cs=tinysrgb&w=300" 
                alt="Folded clean laundry stack" 
                className="w-32 h-24 object-cover rounded-lg mx-auto shadow-md"
              />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={userData.name}
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <Home className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Address"
                    value={userData.address}
                    onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                    required
                  />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={userData.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setUserData(prev => ({ ...prev, pincode: value }));
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                    required
                    maxLength={6}
                  />
                </div>
                <div className="relative">
                  <Building className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Building"
                    value={userData.building}
                    onChange={(e) => setUserData(prev => ({ ...prev, building: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Street"
                  value={userData.street}
                  onChange={(e) => setUserData(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required
                />
              </div>
              {loginType === 'driver' && (
                <>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Aadhaar Number"
                      value={userData.aadhaar || ''}
                      onChange={(e) => setUserData(prev => ({ ...prev, aadhaar: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                      required
                      maxLength={12}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Bank Account Number"
                      value={userData.bankAccount || ''}
                      onChange={(e) => setUserData(prev => ({ ...prev, bankAccount: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      value={userData.ifsc || ''}
                      onChange={(e) => setUserData(prev => ({ ...prev, ifsc: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                      required
                    />
                  </div>
                </>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'service') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">Choose Your Services</h2>
            <p className="text-gray-600">Select one or multiple services that fit your needs</p>
          </div>

          {/* Pickup Time Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-6 border border-white/20">
            <h3 className="font-semibold text-gray-900 mb-4">Pickup Options</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserData(prev => ({ ...prev, pickupTime: 'scheduled' }))}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  userData.pickupTime === 'scheduled'
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium text-gray-900">Scheduled</div>
                <div className="text-xs text-gray-600">2-day delivery</div>
              </button>
              <button
                onClick={() => setUserData(prev => ({ ...prev, pickupTime: 'instant' }))}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  userData.pickupTime === 'instant'
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <Zap className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-sm font-medium text-gray-900">Express</div>
                <div className="text-xs text-gray-600">Premium rates</div>
              </button>
            </div>
            
            {/* Scheduled Time Selection */}
            {userData.pickupTime === 'scheduled' && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={userData.scheduledDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setUserData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                  <select
                    value={userData.scheduledTime}
                    onChange={(e) => setUserData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                    required
                  >
                    <option value="">Select time slot</option>
                    <option value="09:00-11:00">9:00 AM - 11:00 AM</option>
                    <option value="11:00-13:00">11:00 AM - 1:00 PM</option>
                    <option value="13:00-15:00">1:00 PM - 3:00 PM</option>
                    <option value="15:00-17:00">3:00 PM - 5:00 PM</option>
                    <option value="17:00-19:00">5:00 PM - 7:00 PM</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-10 mb-6">
            {serviceOptions.map((service) => {
              const isSelected = userData.services.includes(service.id);
              const clothCount = userData.clothCounts[service.id];
              const isExpress = userData.expressServices[service.id];
              const expressCharge = userData.pickupTime === 'instant' && isExpress ? 
                (service.id === 'ironing' ? 1 : service.id === 'washing' ? 0.5 : service.id === 'drycleaning' ? 2 : 1.5) : 0;
              
              return (
                <div
                  key={service.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-0 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                    isSelected 
                      ? 'border-blue-500 shadow-2xl bg-gradient-to-r from-blue-50 to-blue-100' 
                      : 'border-white/20 hover:shadow-2xl'
                  }`}
                  style={{ overflow: 'hidden', minHeight: '420px', display: 'flex', flexDirection: 'column' }}
                >
                  {/* Service Image Full Width */}
                  <div className="w-full h-64 md:h-80 lg:h-[22rem] bg-gray-100 flex-shrink-0">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover object-center rounded-t-3xl"
                      style={{ display: 'block' }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div className="flex items-center justify-between mb-4" onClick={() => handleServiceToggle(service.id)}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${
                          isSelected 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-400' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-300'
                        }`}>
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg md:text-xl mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-600 md:text-base leading-snug">{service.description}</p>
                          {userData.pickupTime === 'instant' && (
                            <div className="text-xs text-blue-600 font-medium mt-1">
                              {service.id === 'ironing' && 'Express: 1 hour delivery (+$1/item)'}
                              {service.id === 'washing' && 'Express: 1 day delivery (+$0.5/item)'}
                              {service.id === 'both' && 'Express: Same day delivery (+$1.5/item)'}
                              {service.id === 'drycleaning' && 'Express: 1 day delivery (+$2/item)'}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            ${service.price}
                            {userData.pickupTime === 'instant' && expressCharge > 0 && (
                              <span className="text-sm text-blue-600"> +${expressCharge}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">per item</div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                    {/* Express Service Toggle for Instant Pickup */}
                    {isSelected && userData.pickupTime === 'instant' && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200" onClick={(e) => e.stopPropagation()}>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isExpress}
                            onChange={(e) => setUserData(prev => ({
                              ...prev,
                              expressServices: {
                                ...prev.expressServices,
                                [service.id]: e.target.checked
                              }
                            }))}
                            className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-blue-800">
                              {service.id === 'ironing' && 'Express Ironing (1 Hour)'}
                              {service.id === 'washing' && 'Express Washing (1 Day)'}
                              {service.id === 'both' && 'Express Service (Same Day)'}
                              {service.id === 'drycleaning' && 'Express Dry Cleaning (1 Day)'}
                            </div>
                            <div className="text-sm text-blue-600">
                              +${expressCharge} per item
                            </div>
                          </div>
                        </label>
                      </div>
                    )}
                    {/* Cloth Count Selection */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-blue-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-gray-900">Number of Clothes</span>
                          <span className="text-sm text-blue-600 font-semibold">
                            ${((service.price + expressCharge) * clothCount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-blue-200">
                          <button
                            onClick={() => setUserData(prev => ({
                              ...prev,
                              clothCounts: {
                                ...prev.clothCounts,
                                [service.id]: Math.max(0, prev.clothCounts[service.id] - 1)
                              }
                            }))}
                            className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors font-semibold text-blue-600"
                          >
                            -
                          </button>
                          <span className="text-xl font-bold text-gray-900 min-w-[3rem] text-center">
                            {clothCount}
                          </span>
                          <button
                            onClick={() => setUserData(prev => ({
                              ...prev,
                              clothCounts: {
                                ...prev.clothCounts,
                                [service.id]: prev.clothCounts[service.id] + 1
                              }
                            }))}
                            className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors font-semibold text-blue-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {userData.services.length > 0 && getTotalPrice() > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2">
                {getSelectedServices().map((service) => (
                  <div key={service.id} className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                    <div>
                      <span className="font-medium text-gray-900">{service.name}</span>
                      <div className="text-sm text-gray-600">
                        {userData.clothCounts[service.id]} items × ${service.price}
                        {userData.pickupTime === 'instant' && userData.expressServices[service.id] && (
                          <span className="text-blue-600">
                            {' '}(+${service.id === 'ironing' ? '1' : service.id === 'washing' ? '0.5' : service.id === 'drycleaning' ? '2' : '1.5'} express)
                          </span>
                        )}
                      </div>
                      {userData.pickupTime === 'instant' && userData.expressServices[service.id] && (
                        <div className="text-xs text-blue-600 font-medium">
                          {service.id === 'ironing' && '1 Hour Delivery'}
                          {service.id === 'washing' && '1 Day Delivery'}
                          {service.id === 'both' && 'Same Day Delivery'}
                          {service.id === 'drycleaning' && '1 Day Delivery'}
                        </div>
                      )}
                    </div>
                    <span className="text-blue-600 font-semibold">
                      ${((service.price + (userData.pickupTime === 'instant' && userData.expressServices[service.id] ? 
                        (service.id === 'ironing' ? 1 : service.id === 'washing' ? 0.5 : service.id === 'drycleaning' ? 2 : 1.5) : 0)) * 
                        userData.clothCounts[service.id]).toFixed(2)}
                    </span>
                  </div>
                ))}
                {userData.pickupTime === 'scheduled' && (
                  <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Scheduled pickup: {userData.scheduledDate} at {userData.scheduledTime}
                  </div>
                )}
                <div className="border-t border-blue-200 pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleContinueToConfirmation}
            disabled={userData.services.length === 0 || getTotalPrice() === 0 || 
              (userData.pickupTime === 'scheduled' && (!userData.scheduledDate || !userData.scheduledTime))}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 shadow-lg ${
              userData.services.length > 0 && getTotalPrice() > 0 && 
              (userData.pickupTime === 'instant' || (userData.scheduledDate && userData.scheduledTime))
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-700 hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Confirmation
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'confirmation') {
    const selectedServices = getSelectedServices();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">Confirm Your Order</h2>
            <p className="text-gray-600">Review your service details</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
            {/* Services Details */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Selected Services</h3>
              <div className="space-y-3">
                {selectedServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600">
                        {userData.clothCounts[service.id]} items × ${service.price}
                        {userData.pickupTime === 'instant' && userData.expressServices[service.id] && (
                          <span className="text-blue-600">
                            {' '}(+${service.id === 'ironing' ? '1' : service.id === 'washing' ? '0.5' : service.id === 'drycleaning' ? '2' : '1.5'} express)
                          </span>
                        )}
                        {' '}= ${((service.price + (userData.pickupTime === 'instant' && userData.expressServices[service.id] ? 
                          (service.id === 'ironing' ? 1 : service.id === 'washing' ? 0.5 : service.id === 'drycleaning' ? 2 : 1.5) : 0)) * 
                          userData.clothCounts[service.id]).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                      {userData.pickupTime === 'instant' && userData.expressServices[service.id] && (
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          {service.id === 'ironing' && 'Express: 1 Hour Delivery'}
                          {service.id === 'washing' && 'Express: 1 Day Delivery'}
                          {service.id === 'both' && 'Express: Same Day Delivery'}
                          {service.id === 'drycleaning' && 'Express: 1 Day Delivery'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pickup Schedule */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Pickup Schedule</h3>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                {userData.pickupTime === 'scheduled' ? (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">Scheduled Pickup</div>
                      <div className="text-sm text-gray-600">
                        {new Date(userData.scheduledDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} at {userData.scheduledTime}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Delivery within 2 days</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">Express Pickup</div>
                      <div className="text-sm text-gray-600">Immediate pickup requested</div>
                      <div className="text-xs text-blue-600 font-medium mt-1">
                        Premium charges applied for faster delivery
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Pickup Address</h3>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-blue-600 text-sm hover:underline font-medium"
                >
                  {isEditingAddress ? 'Save' : 'Change'}
                </button>
              </div>
              {isEditingAddress ? (
                <div className="space-y-3">
                  <textarea
                    value={userData.address}
                    onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/70 backdrop-blur-sm"
                    rows={2}
                    placeholder="Street Address"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={userData.city}
                      onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={userData.pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setUserData(prev => ({ ...prev, pincode: value }));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                      placeholder="PIN Code"
                      maxLength={6}
                    />
                  </div>
                  <input
                    type="text"
                    value={userData.state}
                    onChange={(e) => setUserData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                    placeholder="State"
                  />
                </div>
              ) : (
                <div className="flex items-start space-x-3 bg-gray-50 rounded-xl p-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                  <div className="text-gray-700">
                    <p className="font-medium">{userData.name}</p>
                    <p>{userData.address}</p>
                    <p>{userData.city}, {userData.state} - {userData.pincode}</p>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">${getTotalPrice().toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {Object.values(userData.clothCounts).reduce((sum, count) => sum + count, 0)} total items across {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
                {userData.pickupTime === 'instant' && (
                  <span className="text-blue-600 font-medium"> • Express service included</span>
                )}
              </p>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Confirm Order
            </button>

            <p className="text-center text-sm text-gray-500">
              {userData.pickupTime === 'scheduled' 
                ? "We'll pick up your clothes at the scheduled time and deliver them back clean within 2 days."
                : "We'll pick up your clothes immediately and deliver them back with express timing."
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'tracking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">Order Confirmed!</h2>
            <p className="text-gray-600">Your driver is on the way</p>
          </div>

          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Order Status</h3>
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Driver Assigned
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Estimated Pickup</p>
                  <p className="text-sm text-gray-600">{driverInfo.estimatedTime}</p>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20">
              <h3 className="font-semibold text-gray-900 mb-4">Your Driver</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src={driverInfo.photo} 
                    alt={driverInfo.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{driverInfo.name}</h4>
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{driverInfo.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{driverInfo.vehicle}</p>
                </div>
                <a 
                  href={`tel:${driverInfo.phone}`}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Vehicle</span>
                  <span className="font-medium text-gray-900">{driverInfo.vehicle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plate Number</span>
                  <span className="font-medium text-gray-900">{driverInfo.plateNumber}</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Services</span>
                  <span className="font-medium">{getSelectedServices().map(s => s.name).join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">{Object.values(userData.clothCounts).reduce((sum, count) => sum + count, 0)} pieces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">+91 {userData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{userData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address</span>
                  <span className="font-medium text-right text-sm">{userData.city}, {userData.state}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Live Tracking */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Live Tracking</h3>
                <Car className="w-5 h-5 text-blue-500" />
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mx-auto mb-2 animate-pulse"></div>
                <p className="text-sm text-gray-600">Driver is {driverInfo.estimatedTime} away</p>
                <p className="text-xs text-gray-500 mt-1">We'll notify you when they arrive</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'driverDashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">Welcome, Driver!</h1>
          <p className="text-gray-700 mb-4">You are logged in as a driver. (Demo dashboard)</p>
          <button
            className="mt-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => {
              setCurrentStep('auth');
              setUserData(prev => ({ ...prev, phone: '', otp: '' }));
              setLoginType('user');
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;