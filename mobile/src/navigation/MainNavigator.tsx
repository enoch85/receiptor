/**
 * Main Navigator
 *
 * Bottom tab navigator for authenticated users.
 * Provides access to Dashboard, Receipts, Budgets, Household, and Settings.
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { DashboardScreen } from '../screens/DashboardScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import type { MainTabParamList } from '../types/navigation';
import { theme } from '../utils/theme';

import { ReceiptsNavigator } from './ReceiptsNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ReceiptsTab"
        component={ReceiptsNavigator}
        options={{
          tabBarLabel: 'Receipts',
          title: 'Receipts',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
