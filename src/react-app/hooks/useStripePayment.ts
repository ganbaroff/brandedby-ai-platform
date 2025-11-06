import { useState } from 'react';

interface PaymentData {
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

interface UseStripePaymentOptions {
  amount: number;
  currency?: string;
  projectData: PaymentData;
  onSuccess?: (projectId: number) => void;
  onError?: (error: string) => void;
}

export function useStripePayment({
  amount,
  currency = 'USD',
  projectData,
  onSuccess,
  onError,
}: UseStripePaymentOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async () => {
    setIsProcessing(true);
    setError(null);

    try {
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

      setClientSecret(data.clientSecret);
      setProjectId(data.projectId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPayment = async (paymentIntentId: string) => {
    if (!projectId) {
      throw new Error('No project ID available');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          projectId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to confirm payment');
      }

      onSuccess?.(projectId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm payment';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    clientSecret,
    projectId,
    error,
    createPaymentIntent,
    confirmPayment,
  };
}
