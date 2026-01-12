import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Formik, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import {CorporationNumberField} from '../components/CorporationNumberField';
import {FormField} from '../components/FormField';
import {PhoneInputField} from '../components/PhoneInputField';
import {SubmitButton} from '../components/SubmitButton';
import {validateCorporationNumber, submitProfile} from '../services/api';
import {VALIDATION} from '../constants/validation';
import {theme} from '../theme';
import type {ProfileFormValues} from '../types';

// Yup validation schema for the form
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(VALIDATION.FIRST_NAME_MAX, VALIDATION.ERROR_MESSAGES.firstNameMax)
    .required(VALIDATION.ERROR_MESSAGES.required),
  lastName: Yup.string()
    .max(VALIDATION.LAST_NAME_MAX, VALIDATION.ERROR_MESSAGES.lastNameMax)
    .required(VALIDATION.ERROR_MESSAGES.required),
  phone: Yup.string()
    .matches(VALIDATION.PHONE_REGEX, VALIDATION.ERROR_MESSAGES.phoneInvalid)
    .required(VALIDATION.ERROR_MESSAGES.required),
  corporationNumber: Yup.string()
    .test('length', VALIDATION.ERROR_MESSAGES.corporationLength, val =>
      val ? val.replace(/\s/g, '').length === 9 : false,
    )
    .required(VALIDATION.ERROR_MESSAGES.required),
});

// Default empty values for the form
const initialValues: ProfileFormValues = {
  firstName: '',
  lastName: '',
  phone: '+1',
  corporationNumber: '',
};

/**
 * Onboarding screen for business profile creation
 * Handles form validation, corporation number check, and profile submission
 */
export default function OnboardingScreen() {
  const handleSubmit = async (
    values: ProfileFormValues,
    {setSubmitting, resetForm}: FormikHelpers<ProfileFormValues>,
  ) => {
    setSubmitting(true);

    try {
      // Clean corporation number before validation (remove spaces)
      const cleanCorp = values.corporationNumber.replace(/\s/g, '');
      const validation = await validateCorporationNumber(cleanCorp);

      if (!validation.valid) {
        throw new Error(validation.message || 'Invalid corporation number');
      }

      const result = await submitProfile(values);

      if (result.success) {
        Alert.alert('Success', 'Profile created successfully!', [
          {text: 'OK', onPress: () => resetForm()},
        ]);
      } else {
        Alert.alert('Submission Failed', result.message || 'Unknown error');
      }
    } catch (err: any) {
      const message =
        err.message || 'Failed to submit profile. Please try again.';

      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Onboarding Form</Text>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnBlur
            validateOnChange={false} // Only validate on blur/submit for better UX
            onSubmit={handleSubmit}>
            {({handleSubmit, isSubmitting, isValid, dirty}) => (
              <>
                <FormField
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  maxLength={50}
                />

                <FormField
                  name="lastName"
                  label="Last Name"
                  placeholder="Smith"
                  maxLength={50}
                />

                <PhoneInputField />

                <CorporationNumberField />

                <SubmitButton
                  title="Submit"
                  disabled={false}
                  onPress={() => handleSubmit()}
                />
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {flex: 1},
  scrollContent: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xl * 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 32,
  },
});
