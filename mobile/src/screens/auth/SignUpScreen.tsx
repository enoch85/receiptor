/**
 * Sign Up Screen
 *
 * Allows users to create a new account with email and password.
 * Includes form validation, password confirmation, and error handling.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, Checkbox } from 'react-native-paper';

import { useAuth } from '../../hooks/useAuth';
import type { AuthStackScreenProps } from '../../types/navigation';
import { VALIDATION, APP_NAME } from '../../utils/constants';
import { theme } from '../../utils/theme';

type Props = AuthStackScreenProps<'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });

  /**
   * Validate email format
   */
  const validateEmail = (value: string): boolean => {
    if (!value) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return false;
    }
    if (!VALIDATION.EMAIL_REGEX.test(value)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  /**
   * Validate password strength
   */
  const validatePassword = (value: string): boolean => {
    if (!value) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return false;
    }
    if (value.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        password: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
      }));
      return false;
    }
    if (value.length > VALIDATION.MAX_PASSWORD_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        password: `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`,
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: '' }));
    return true;
  };

  /**
   * Validate password confirmation
   */
  const validateConfirmPassword = (value: string): boolean => {
    if (!value) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Please confirm your password' }));
      return false;
    }
    if (value !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    return true;
  };

  /**
   * Validate terms acceptance
   */
  const validateTerms = (): boolean => {
    if (!acceptedTerms) {
      setErrors((prev) => ({ ...prev, terms: 'You must accept the terms and conditions' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, terms: '' }));
    return true;
  };

  /**
   * Handle sign up submission
   */
  const handleSignUp = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const areTermsAccepted = validateTerms();

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !areTermsAccepted) {
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert(
        'Account Created',
        'Your account has been created successfully. Please check your email to verify your account.',
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join {APP_NAME} to start tracking your spending</Text>
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

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => validatePassword(password)}
            secureTextEntry={!showPassword}
            autoComplete="password"
            error={!!errors.password}
            mode="outlined"
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <HelperText type="error" visible={!!errors.password}>
            {errors.password}
          </HelperText>

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => validateConfirmPassword(confirmPassword)}
            secureTextEntry={!showConfirmPassword}
            autoComplete="password"
            error={!!errors.confirmPassword}
            mode="outlined"
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          <HelperText type="error" visible={!!errors.confirmPassword}>
            {errors.confirmPassword}
          </HelperText>

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={acceptedTerms ? 'checked' : 'unchecked'}
              onPress={() => {
                setAcceptedTerms(!acceptedTerms);
                setErrors((prev) => ({ ...prev, terms: '' }));
              }}
            />
            <Text style={styles.checkboxLabel}>
              I accept the{' '}
              <Text
                style={styles.link}
                onPress={() => Alert.alert('Terms & Conditions', 'Coming soon')}
              >
                Terms & Conditions
              </Text>{' '}
              and{' '}
              <Text
                style={styles.link}
                onPress={() => Alert.alert('Privacy Policy', 'Coming soon')}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
          <HelperText type="error" visible={!!errors.terms}>
            {errors.terms}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading || loading}
            style={styles.button}
          >
            Create Account
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button mode="text" onPress={() => navigation.navigate('Login')} compact>
            Sign In
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
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: theme.spacing.xs,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
});
