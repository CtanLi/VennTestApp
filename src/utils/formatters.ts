/**
 * Formats a corporation number string into a standardized format with spaces:
 * - Up to 3 digits: no spaces (e.g., "123")
 * - 4–6 digits: one space after first 3 digits (e.g., "123 456")
 * - 7+ digits: spaces after 3rd and 6th digits (e.g., "123 456 789")
 * 
 * @param value - The input string that may contain numbers and/or non-numeric characters
 * @returns Formatted corporation number as a string
 */
export const formatCorporationNumber = (value: string): string => {
  // Remove all non-digit characters from the input
  const digits = value.replace(/\D/g, '');

  // If 3 digits or fewer return as is (no formatting needed)
  if (digits.length <= 3) return digits;

  // If between 4 and 6 digits add one space after first 3 digits
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;

  // Any digits beyond 9 are ignored
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
};