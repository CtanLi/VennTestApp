/**
 * Centralized validation constants for form fields
 * Used in Yup schema and error message display
 */
export const VALIDATION = {
  FIRST_NAME_MAX: 50,
  LAST_NAME_MAX: 50,
  CORPORATION_LENGTH: 9,

  // Regex for Canadian phone numbers starting with +1
  // Format: +1 followed by 10 digits (area code 2-9, no 0 or 1 as first digit after +1)
  PHONE_REGEX: /^\+1[2-9]\d{9}$/,

  /**
   * User-facing error messages
   * Keep these concise and helpful
   */
  ERROR_MESSAGES: {
    required: 'This field is required',
    firstNameMax: 'Maximum 50 characters',
    lastNameMax: 'Maximum 50 characters',
    phoneInvalid: 'Please enter a valid Canadian phone number (e.g. +14165551234)',
    corporationLength: 'Must be exactly 9 digits',
    corporationInvalid: 'Invalid corporation number',
  },
};