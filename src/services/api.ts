import axios from 'axios';
import type { CorporationValidationResult, ProfileFormValues } from '../types';

// Axios instance with base configuration for all API calls
const api = axios.create({
  baseURL: 'https://fe-hometask-api.qa.vault.tryvault.com',
  timeout: 12000,
});

/**
 * Validates a corporation number using the backend validation endpoint
 */
export const validateCorporationNumber = async (
  number: string
): Promise<CorporationValidationResult> => {
  try {
    const response = await api.get<CorporationValidationResult>(
      `/corporation-number/${number}`
    );

    // Success case (200-299)
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    // Expected client error with message
    if (response.status === 400 && response.data?.message) {
      return {
        valid: false,
        message: response.data.message,
      };
    }

    // Any other unexpected status
    return {
      valid: false,
      message: `Server error (${response.status}). Please try again later.`,
    };
  } catch (error: any) {
    let message = 'Service unavailable. Please check your connection.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || `Error ${error.response.status}`;
      } else if (error.request) {
        message = 'No response from server. Please check your internet connection.';
      } else {
        message = error.message || 'Unexpected error';
      }
    }

    return { valid: false, message };
  }
};

/**
 * Submits cleaned profile data to create/update user profile
 */
export const submitProfile = async (
  values: ProfileFormValues
): Promise<{ success: boolean; message?: string }> => {
  // Remove spaces from corporation number before sending
  const cleanValues = {
    ...values,
    corporationNumber: values.corporationNumber.replace(/\s/g, ''),
  };

  try {
    const response = await api.post('/profile-details', cleanValues);

    if (response.status === 200) {
      return { success: true };
    }

    return {
      success: false,
      message: `Unexpected response status: ${response.status}`,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        const message = data?.message || 'Invalid or missing fields. Please check your input.';
        return { success: false, message };
      }

      return {
        success: false,
        message: `Request failed with status ${status}`,
      };
    }

    return {
      success: false,
      message: 'Network error. Please check your internet connection.',
    };
  }
};