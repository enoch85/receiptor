/**
 * Dashboard Screen
 *
 * Main dashboard showing budget overview, recent receipts, and quick stats.
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { useAuth } from '../hooks/useAuth';
import { theme } from '../utils/theme';

export function DashboardScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budget This Month</Text>
        <Text style={styles.placeholder}>Coming soon...</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Receipts</Text>
        <Text style={styles.placeholder}>No receipts yet</Text>
      </View>

      <Button mode="outlined" onPress={signOut} style={styles.button}>
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  placeholder: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  button: {
    marginTop: theme.spacing.lg,
  },
});
