import { AlertCircle, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { useState } from 'react';

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

interface PaymentProcessorProps {
  amount: number;
  currency?: string;
  projectData: ProjectData;
  onPaymentSuccess?: (projectId: number) => void;
  onPaymentError?: (error: string) => void;
}

export default function PaymentProcessor({ 
  amount, 
  currency = 'USD',
  projectData,
  onPaymentSuccess,
  onPaymentError 
}: PaymentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  });
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formatCardNumber = (value: string) => {
    // Remove all spaces and non-digits
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Max length for card with spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validateForm = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = formData;
    
    if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length < 13) {
      return 'Please enter a valid card number';
    }
    
    if (!expiryDate || expiryDate.length !== 5) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cvv || cvv.length < 3) {
      return 'Please enter a valid CVV';
    }
    
    if (!cardholderName.trim()) {
      return 'Please enter the cardholder name';
    }
    
    return null;
  };

  const processPayment = async () => {
    // Create payment intent with real Stripe integration
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        projectData,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create payment intent');
    }

    // Simulate card processing
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // Confirm payment
    const confirmResponse = await fetch('/api/stripe/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId: data.clientSecret.split('_secret_')[0],
        projectId: data.projectId,
      }),
    });

    const confirmData = await confirmResponse.json();

    if (!confirmData.success) {
      throw new Error(confirmData.error || 'Payment confirmation failed');
    }

    return {
      projectId: data.projectId,
      status: 'succeeded'
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setPaymentStatus('error');
      return;
    }
    
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');
    
    try {
      const result = await processPayment();
      
      setPaymentStatus('success');
      onPaymentSuccess?.(result.projectId);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      setErrorMessage(errorMsg);
      setPaymentStatus('error');
      onPaymentError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">Your video project has been created and will be processed shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 p-6">
      
      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'card', label: 'Card', icon: CreditCard },
            { id: 'paypal', label: 'PayPal', icon: () => <div className="text-blue-600 font-bold text-xs">PP</div> },
            { id: 'crypto', label: 'Crypto', icon: () => <div className="text-orange-500 font-bold text-xs">₿</div> }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPaymentMethod(id as 'card' | 'paypal' | 'crypto')}
              className={`p-3 rounded-lg border-2 transition-all ${
                paymentMethod === id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              placeholder="MM/YY"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              placeholder="123"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            placeholder="John Doe"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Error Message */}
        {paymentStatus === 'error' && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center space-x-2 text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
          <Lock className="w-4 h-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Pay ${currency} ${amount.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
}
