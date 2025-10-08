/**
 * Navigation Types
 *
 * Type definitions for React Navigation.
 * Provides type-safe navigation throughout the app.
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Root Stack Navigator
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

/**
 * Auth Stack Navigator
 */
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Onboarding: undefined;
};

/**
 * Main Tab Navigator
 */
export type MainTabParamList = {
  DashboardTab: undefined;
  ReceiptsTab: NavigatorScreenParams<ReceiptsStackParamList>;
  BudgetsTab: NavigatorScreenParams<BudgetsStackParamList>;
  HouseholdTab: undefined;
  SettingsTab: undefined;
};

/**
 * Receipts Stack Navigator
 */
export type ReceiptsStackParamList = {
  ReceiptList: undefined;
  ReceiptDetail: { receiptId: string };
  ReceiptCapture: undefined;
};

/**
 * Budgets Stack Navigator
 */
export type BudgetsStackParamList = {
  BudgetList: undefined;
  BudgetDetail: { budgetId: string };
  CreateBudget: undefined;
};

/**
 * Screen Props Types
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type ReceiptsStackScreenProps<T extends keyof ReceiptsStackParamList> =
  NativeStackScreenProps<ReceiptsStackParamList, T>;

export type BudgetsStackScreenProps<T extends keyof BudgetsStackParamList> = NativeStackScreenProps<
  BudgetsStackParamList,
  T
>;
