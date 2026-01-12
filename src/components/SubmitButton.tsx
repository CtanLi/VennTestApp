import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import {ArrowRight} from 'lucide-react-native';
import {theme} from '../theme';

type Props = {
  title: string;
  disabled: boolean;
  onPress: () => void;
};

/**
 * Primary submit button for forms
 * Features: themed styling, disabled state, icon, and press feedback
 */
export const SubmitButton = ({title, disabled, onPress}: Props) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.disabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}>
    <View style={styles.content}>
      <Text style={styles.buttonText}>{title}</Text>
      <ArrowRight size={18} color="white" style={styles.icon} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.button,
    borderRadius: theme.radii.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  disabled: {
    backgroundColor: '#9CA3AF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 8, 
  },
});
