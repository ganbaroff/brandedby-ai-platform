import { useState, useCallback } from 'react';

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

interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  projectId?: number;
  error?: {
    code?: string;
    message: string;
    details?: unknown;
  };
}

interface ConfirmPaymentResponse {
  success: boolean;
  message?: string;
  error?: {
    code?: string;
    message: string;
    details?: unknown;
  };
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

  const createPaymentIntent = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Validate amount
      if (amount <= 0) {
        throw new Error('Payment amount must be greater than zero');
      }

      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for auth
        body: JSON.stringify({
          amount,
          currency: currency.toLowerCase(),
          projectData,
        }),
      });

      let data: PaymentIntentResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Failed to parse server response');
      }

      if (!response.ok || !data.success) {
        const errorMessage = data.error?.message || data.error || 'Failed to create payment intent';
        throw new Error(errorMessage);
      }

      if (!data.clientSecret || !data.projectId) {
        throw new Error('Invalid response from server');
      }

      setClientSecret(data.clientSecret);
      setProjectId(data.projectId);
      
      return {
        clientSecret: data.clientSecret,
        projectId: data.projectId,
      };
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to initialize payment';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [amount, currency, projectData, onError]);

  const confirmPayment = useCallback(async (paymentIntentId: string) => {
    if (!projectId) {
      const errorMsg = 'No project ID available. Please create a payment intent first.';
      setError(errorMsg);
      onError?.(errorMsg);
      throw new Error(errorMsg);
    }

    if (!paymentIntentId || paymentIntentId.trim() === '') {
      const errorMsg = 'Payment intent ID is required';
      setError(errorMsg);
      onError?.(errorMsg);
      throw new Error(errorMsg);
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          paymentIntentId: paymentIntentId.trim(),
          projectId,
        }),
      });

      let data: ConfirmPaymentResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Failed to parse server response');
      }

      if (!response.ok || !data.success) {
        const errorMessage = data.error?.message || data.error || 'Failed to confirm payment';
        throw new Error(errorMessage);
      }

      onSuccess?.(projectId);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to confirm payment';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [projectId, onSuccess, onError]);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setClientSecret(null);
    setProjectId(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    clientSecret,
    projectId,
    error,
    createPaymentIntent,
    confirmPayment,
    reset,
  };
}
