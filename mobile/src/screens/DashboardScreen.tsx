/**
 * Dashboard Screen
 *
 * Main dashboard showing budget overview, recent receipts, and quick stats.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

import { useAuth } from '../hooks/useAuth';
import { useHousehold } from '../hooks/useHousehold';
import { supabase } from '../services/supabase';
import { theme } from '../utils/theme';

export function DashboardScreen() {
  const { user } = useAuth();
  const { household, isLoading, createHousehold, isError } = useHousehold();
  const [creating, setCreating] = React.useState(false);

  // Auto-create household on mount if user has none
  React.useEffect(() => {
    const autoCreateHousehold = async () => {
      // Skip if already has household, still loading, or already creating
      if (!user || household !== null || isLoading || creating) return;

      setCreating(true);
      try {
        // Double-check: verify user doesn't have a household already
        const { data: existingMembers } = await supabase
          .from('household_members')
          .select('household_id')
          .eq('user_id', user.id)
          .limit(1);

        if (existingMembers && existingMembers.length > 0) {
          return;
        }

        // Smart name generation:
        // 1. Try display_name from user_profiles
        // 2. Fall back to email username
        // 3. Add "Home" suffix
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();

        const name = profile?.display_name || user.email?.split('@')[0] || 'My';
        const householdName = `${name}'s Home`;

        await createHousehold(householdName);
      } catch (err) {
        console.error('Failed to auto-create household:', err);
      } finally {
        setCreating(false);
      }
    };

    autoCreateHousehold();
  }, [user, household, isLoading, creating, createHousehold]);

  if (isLoading || creating) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          {creating ? 'Setting up your household...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  // Show error if household creation failed
  if (!household && isError) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>⚠️ Setup Error</Text>
        <Text style={styles.errorText}>
          Failed to create your household. Please restart the app.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>{household?.name || `Welcome, ${user?.email}`}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budget This Month</Text>
        <Text style={styles.placeholder}>Coming soon...</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Receipts</Text>
        <Text style={styles.placeholder}>No receipts yet</Text>
      </View>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  welcomeCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  welcomeSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  helperText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  createButton: {
    width: '100%',
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
  error: {
    marginTop: theme.spacing.md,
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    textAlign: 'center',
  },
  errorText: {
    marginVertical: theme.spacing.lg,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    lineHeight: 22,
  },
});
