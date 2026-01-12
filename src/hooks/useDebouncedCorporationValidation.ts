import { useState, useEffect, useCallback } from 'react';
import { validateCorporationNumber } from '../services/api';
import type { CorporationValidationResult } from '../types';

const DEBOUNCE_MS = 650;

/**
 * Custom hook that validates a corporation number with debounce
 * Only triggers API call when exactly 9 digits are entered (after removing spaces)
 */
export const useDebouncedCorporationValidation = (rawValue: string) => {
  // Remove spaces for validation (user can type with formatting)
  const value = rawValue.replace(/\s/g, '');

  const [result, setResult] = useState<CorporationValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized validation function
  const check = useCallback(async (num: string) => {
    // Early return if not exactly 9 digits
    if (num.length !== 9) {
      setResult(null);
      setError(null);
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const res = await validateCorporationNumber(num);
      setResult(res);
      if (!res.valid) {
        setError(res.message || 'Service unavailable. Please try again later.');
      }
    } catch {
      setError('Failed to validate corporation number');
      setResult({ valid: false });
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Debounced effect: only validate after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.length === 9) {
        check(value);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, check]);

  return { result, isValidating, error };
};