/**
 * Form values for company profile / user registration/update
 */
export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  corporationNumber: string;
}

/**
 * Result of corporation number validation check
 */
export interface CorporationValidationResult {
  valid: boolean;
  message?: string;
}