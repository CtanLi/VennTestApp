import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useField, useFormikContext } from 'formik';
import { theme } from '../theme';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
};

/**
 * Reusable text input field integrated with Formik
 * Supports validation error display and theme-consistent styling
 */
export const FormField = ({
  name,
  label,
  placeholder,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: Props) => {
  const { handleChange, handleBlur } = useFormikContext<any>();
  const [field, meta] = useField(name);

  const hasError = meta.touched && !!meta.error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        placeholder={placeholder}
        value={field.value}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        placeholderTextColor={theme.colors.textSecondary}
      />
      {hasError && <Text style={styles.error}>{meta.error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    padding: 14,
    fontSize: 16,
    backgroundColor: theme.colors.surface,
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