/**
 * Centralized theme configuration for the React Native application.
 * Provides consistent colors, spacing, and border radius values across the app.
 */
export const theme = {
  /**
   * Color palette
   * All colors are defined as hex strings for use in styles, components, and themes
   */
  colors: {
    button: '#000000',        // Primary button background/text
    primary: '#0066CC',       // Main brand/accent color
    success: '#22C55E',       // Success states (e.g., confirmation, completed)
    error: '#EF4444',         // Error/validation failure states
    border: '#D1D5DB',        // Input borders, dividers, subtle outlines
    text: '#1F2937',          // Primary text color (almost black)
    textSecondary: '#6B7280', // Secondary/supporting text (gray)
    surface: '#FFFFFF',       // Cards, modals, elevated surfaces
    background: '#f9fafb',    // Main screen/app background
  },

  /**
   * Consistent spacing scale (in pixels)
   * Use these values for margins, padding, and component gaps
   */
  spacing: {
    xs: 4,    
    sm: 8,    
    md: 16,   
    lg: 24,   
    xl: 32,   
  },

  /**
   * Border radius scale (in pixels)
   * Use for buttons, cards, inputs, and other rounded elements
   */
  radii: {
    sm: 8,    
    md: 12,  
    lg: 16,   
  },
};