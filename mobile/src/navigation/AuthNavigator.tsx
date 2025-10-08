/**
 * Auth Navigator
 *
 * Stack navigator for authentication-related screens.
 * Used when user is not authenticated.
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { LoginScreen } from '../screens/auth/LoginScreen';
import type { AuthStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* TODO: Add SignUp, ForgotPassword, Onboarding screens */}
    </Stack.Navigator>
  );
}
