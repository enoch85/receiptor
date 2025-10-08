/**
 * Main Navigator
 *
 * Bottom tab navigator for authenticated users.
 * Provides access to Dashboard, Receipts, Budgets, Household, and Settings.
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { DashboardScreen } from '../screens/DashboardScreen';
import type { MainTabParamList } from '../types/navigation';
import { theme } from '../utils/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          title: 'Dashboard',
          // tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      {/* TODO: Add other tabs (Receipts, Budgets, Household, Settings) */}
    </Tab.Navigator>
  );
}
