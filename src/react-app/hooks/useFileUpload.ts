import { useState, useCallback, useRef } from 'react';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_MB, validateFileSize, validateFileType } from '@/shared/validation';

export type FileUploadType = 'selfie' | 'location' | 'additional_character';

interface UseFileUploadResult {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File, type: FileUploadType) => Promise<string | null>;
  reset: () => void;
}

interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    key: string;
    size: number;
    type: string;
  };
  error?: {
    code?: string;
    message: string;
    details?: unknown;
  };
}

export function useFileUpload(): UseFileUploadResult {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const uploadFile = useCallback(async (
    file: File, 
    type: FileUploadType
  ): Promise<string | null> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    try {
      // Validate file type
      try {
        validateFileType(file.type, ALLOWED_IMAGE_TYPES);
      } catch (validationError) {
        const message = validationError instanceof Error 
          ? validationError.message 
          : `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`;
        throw new Error(message);
      }

      // Validate file size
      try {
        validateFileSize(file.size, MAX_FILE_SIZE_MB);
      } catch (validationError) {
        const message = validationError instanceof Error
          ? validationError.message
          : `File size exceeds maximum allowed size of ${MAX_FILE_SIZE_MB}MB`;
        throw new Error(message);
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Simulate progress (since we can't track real upload progress with fetch)
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          // Cap at 90% until upload completes
          if (prev >= 90) return 90;
          return Math.min(prev + 10, 90);
        });
      }, 200);

      // Upload file
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for auth
      });

      // Clear progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(100);

      // Parse response
      let data: UploadResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Failed to parse server response');
      }

      // Handle error responses
      if (!response.ok) {
        const errorMessage = data.error?.message || data.error || `Upload failed: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      if (!data.success || !data.data) {
        const errorMessage = data.error?.message || data.error || 'Upload failed';
        throw new Error(errorMessage);
      }

      return data.data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      
      // Clear progress interval on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploading, progress, error, uploadFile, reset };
}
