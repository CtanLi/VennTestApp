import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import MaskInput from 'react-native-mask-input';
import {CheckCircle, AlertCircle} from 'lucide-react-native';
import {useField, useFormikContext} from 'formik';
import {useDebouncedCorporationValidation} from '../hooks/useDebouncedCorporationValidation';
import {theme} from '../theme';
import {VALIDATION} from '../constants/validation';

// Mask format: XXX XXX XXX (9 digits with spaces)
const CORPORATION_MASK = [
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
];

/**
 * Form field for Canadian corporation number with real-time formatting and validation
 * Features: masked input (XXX XXX XXX), debounce API validation, success/error indicators
 */
export const CorporationNumberField = () => {
  const {handleBlur, values, setFieldValue, errors, touched, setFieldError} =
    useFormikContext<any>();
  const [field, meta] = useField('corporationNumber');

  const clean = values.corporationNumber.replace(/\s/g, '');
  const {
    result,
    isValidating,
    error: apiError,
  } = useDebouncedCorporationValidation(clean);

  // Priority: API result overrides local/Yup validation when available
  const hasApiError = !!apiError;
  const isApiValid =
    result?.valid === true && !isValidating && clean.length === 9;

  // Only consider local/Yup error if we haven't received an API response yet
  const hasLocalError =
    touched.corporationNumber && !!meta.error && !result && !isValidating;

  const showError = hasApiError || hasLocalError;
  const errorMessage = hasApiError
    ? apiError || VALIDATION.ERROR_MESSAGES.corporationInvalid
    : meta.error || VALIDATION.ERROR_MESSAGES.corporationInvalid;

  // Clear Formik error once API confirms validation
  React.useEffect(() => {
    if (isApiValid && meta.error) {
      setFieldError('corporationNumber', undefined);
    }
  }, [isApiValid, meta.error, setFieldError]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Corporation Number (9 digits)</Text>

      <View style={styles.inputWrapper}>
        <MaskInput
          value={field.value}
          onChangeText={masked => setFieldValue('corporationNumber', masked)}
          mask={CORPORATION_MASK}
          style={[
            styles.input,
            showError && styles.inputError,
            isApiValid && styles.inputValid,
          ]}
          placeholder="123 456 789"
          keyboardType="numeric"
          onBlur={handleBlur('corporationNumber')}
          maxLength={11}
        />

        <View style={styles.iconContainer}>
          {isValidating && (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          )}
          {isApiValid && <CheckCircle size={24} color={theme.colors.success} />}
          {showError && !isValidating && (
            <AlertCircle size={24} color={theme.colors.error} />
          )}
        </View>
      </View>

      {showError && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 20},
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    padding: 14,
    fontSize: 16,
    backgroundColor: theme.colors.surface,
    paddingRight: 48,
  },
  inputError: {borderColor: theme.colors.error},
  inputValid: {borderColor: theme.colors.success},
  iconContainer: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{translateY: -12}],
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 5,
  },
});
