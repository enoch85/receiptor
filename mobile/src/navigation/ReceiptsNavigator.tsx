/**
 * Receipts Navigator
 *
 * Stack navigator for receipt-related screens.
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import {
  ReceiptListScreen,
  ReceiptCaptureScreen,
  ReceiptDetailScreen,
} from '../screens/receipts';
import type { ReceiptsStackParamList } from '../types/navigation';
import { theme } from '../utils/theme';

const Stack = createNativeStackNavigator<ReceiptsStackParamList>();

export function ReceiptsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ReceiptList"
        component={ReceiptListScreen}
        options={{ title: 'Receipts' }}
      />
      <Stack.Screen
        name="ReceiptDetail"
        component={ReceiptDetailScreen}
        options={{ title: 'Receipt Details' }}
      />
      <Stack.Screen
        name="ReceiptCapture"
        component={ReceiptCaptureScreen}
        options={{
          title: 'Capture Receipt',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
