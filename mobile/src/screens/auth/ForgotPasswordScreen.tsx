/**
 * Forgot Password Screen
 *
 * Allows users to request a password reset email.
 * Includes email validation and confirmation message.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';

import { useAuth } from '../../hooks/useAuth';
import type { AuthStackScreenProps } from '../../types/navigation';
import { VALIDATION } from '../../utils/constants';
import { theme } from '../../utils/theme';

type Props = AuthStackScreenProps<'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '' });

  /**
   * Validate email format
   */
  const validateEmail = (value: string): boolean => {
    if (!value) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!VALIDATION.EMAIL_REGEX.test(value)) {
      setErrors({ email: 'Invalid email format' });
      return false;
    }
    setErrors({ email: '' });
    return true;
  };

  /**
   * Handle password reset submission
   */
  const handleResetPassword = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Check Your Email',
        'If an account exists with this email, you will receive a password reset link shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we&apos;ll send you a link to reset your password
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => validateEmail(email)}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            error={!!errors.email}
            mode="outlined"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Send Reset Link
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.textButton}
          >
            Back to Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: theme.spacing.xs,
  },
  button: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  textButton: {
    marginTop: theme.spacing.sm,
  },
});
