import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PhoneInput from '@linhnguyen96114/react-native-phone-input';
import {useField, useFormikContext} from 'formik';
import {theme} from '../theme';
import {VALIDATION} from '../constants/validation';

/**
 * Form field for Canadian phone number input
 * Uses third-party PhoneInput component + Formik integration
 * Forces Canadian format (+1 prefix hidden from picker)
 */
export const PhoneInputField = () => {
  const {setFieldValue, setFieldTouched, errors, touched} =
    useFormikContext<any>();
  const [field] = useField('phone');

  const hasError = touched.phone && !!errors.phone;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number</Text>
      <PhoneInput
      // Remove +1 prefix for display (we store full formatted number)
        defaultValue={field.value?.replace('+1', '')?.trim() || ''}
        defaultCode="CA"
        layout="first"
        // Hide country picker since we only support Canada
        countryPickerButtonStyle={{display: 'none'}}
        containerStyle={styles.containerStyle}
        textContainerStyle={[
          styles.textContainer,
          {
            width: '100%',
            flex: 1,
            height: 52,
            justifyContent: 'center',
          },
          hasError && styles.inputError,
        ]}
        textInputStyle={[styles.textInput, {height: 52}]}
        // Always store full formatted number including +1
        onChangeFormattedText={text => setFieldValue('phone', text)}
        onBlur={() => setFieldTouched('phone', true)}
        placeholder="555 555 555"
      />

      {hasError && (
        <Text style={styles.error}>
          {typeof errors.phone === 'string'
            ? errors.phone
            : 'Invalid phone number'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 20},
  containerStyle: {width: '100%'},
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  textContainer: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  textInput: {
    fontSize: 16,
    color: theme.colors.text,
    paddingLeft: 8,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 5,
  },
});
