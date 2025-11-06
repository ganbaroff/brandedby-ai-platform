import { useNavigate } from "react-router";

import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import LoadingSpinner from "@/react-app/components/LoadingSpinner";
import PaymentProcessor from "@/react-app/components/PaymentProcessor";
import { useAuth } from "@getmocha/users-service/react";
import {
    ArrowLeft,
    Check,
    Shield
} from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectData {
  celebrity_id?: number;
  template_id?: number;
  package_type: 'Standard' | 'Pro' | 'Premium';
  video_format: string;
  niche: string;
  description: string;
  custom_location_url?: string;
  additional_character_url?: string;
  selfie_url?: string;
}

const PACKAGE_DETAILS = {
  Standard: {
    price: 6,
    duration: '30-second video',
    features: [
      'Basic templates',
      'Standard quality',
      '48-hour access',
      'With watermark'
    ]
  },
  Pro: {
    price: 19,
    duration: '60-second video',
    features: [
      'Custom location upload',
      'HD quality',
      'No watermark',
      'Premium templates',
      'Priority generation'
    ]
  },
  Premium: {
    price: 49,
    duration: '90-second video',
    features: [
      'Unlimited locations',
      '4K quality',
      'No watermark',
      'All premium templates',
      'Multiple characters',
      'Instant generation',
      'API access'
    ]
  }
};

export default function Payment() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/');
      return;
    }

    // Load project data from session storage
    const storedData = sessionStorage.getItem('projectData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setProjectData(data);
      } catch (error) {
        console.error('Error parsing project data:', error);
        navigate('/celebrities');
      }
    } else {
      navigate('/celebrities');
    }
    setLoading(false);
  }, [user, isPending, navigate]);

  if (isPending || loading || !projectData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <LoadingSpinner fullScreen message="Loading payment details..." />
        <Footer />
      </div>
    );
  }

  const packageInfo = PACKAGE_DETAILS[projectData.package_type];
  const orderSummary = {
    package: `${projectData.package_type} Package`,
    price: packageInfo.price,
    duration: packageInfo.duration,
    features: packageInfo.features
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Payment Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Payment</h1>
              
              {!paymentSuccess ? (
                <PaymentProcessor 
                  amount={orderSummary.price}
                  currency="USD"
                  projectData={projectData}
                  onPaymentSuccess={() => {
                    setPaymentSuccess(true);
                    setShowSuccessAnim(true);
                    setTimeout(() => setShowSuccessAnim(false), 2000);
                  }}
                  onPaymentError={(error) => {
                    console.error('Payment error:', error);
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  {showSuccessAnim && (
                    <div className="animate-bounce mb-4">
                      <Check className="w-16 h-16 text-green-500" />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
                  <p className="text-gray-700 mb-4">Your order is being processed. You will receive a confirmation email soon.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                      <Shield className="w-4 h-4 mr-1" /> SSL Secured
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                      <Check className="w-4 h-4 mr-1" /> PCI DSS Compliant
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-200">
                      <Shield className="w-4 h-4 mr-1" /> Privacy Protected
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-3xl p-8 shadow-lg h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{orderSummary.package}</h3>
                    <p className="text-gray-600">{orderSummary.duration}</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${orderSummary.price}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Included Features:</h4>
                  <ul className="space-y-2">
                    {orderSummary.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-purple-600">${orderSummary.price}</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
