/**
 * Settings Screen
 *
 * User settings including household management, profile, and preferences.
 */

import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Divider, List } from 'react-native-paper';

import { useAuth } from '../hooks/useAuth';
import { useHousehold } from '../hooks/useHousehold';
import { supabase } from '../services/supabase';
import { theme } from '../utils/theme';

export function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { household, householdId } = useHousehold();
  const queryClient = useQueryClient();

  const [householdName, setHouseholdName] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Initialize household name when loaded
  React.useEffect(() => {
    if (household?.name) {
      setHouseholdName(household.name);
    }
  }, [household]);

  const handleSaveHouseholdName = async () => {
    if (!householdId || !householdName.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('households')
        .update({ name: householdName.trim() })
        .eq('id', householdId);

      if (error) throw error;

      // Invalidate household query to refresh data everywhere
      queryClient.invalidateQueries({ queryKey: ['households', user?.id] });

      Alert.alert('Success', 'Household name updated!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update household name:', error);
      Alert.alert('Error', 'Failed to update household name. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setHouseholdName(household?.name || '');
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          const { error } = await signOut();
          if (error) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Household</Text>

      <View style={styles.card}>
        <TextInput
          label="Household Name"
          value={householdName}
          onChangeText={setHouseholdName}
          mode="outlined"
          disabled={!isEditing || isSaving}
          style={styles.input}
          right={
            !isEditing ? <TextInput.Icon icon="pencil" onPress={() => setIsEditing(true)} /> : null
          }
        />

        {isEditing && (
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={handleCancelEdit}
              disabled={isSaving}
              style={styles.halfButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveHouseholdName}
              loading={isSaving}
              disabled={isSaving || !householdName.trim()}
              style={styles.halfButton}
            >
              Save
            </Button>
          </View>
        )}

        <Text style={styles.helperText}>💡 This name is visible to all household members</Text>
      </View>

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>Account</Text>

      <View style={styles.card}>
        <List.Item
          title="Email"
          description={user?.email}
          left={(props) => <List.Icon {...props} icon="email" />}
        />

        <List.Item
          title="User ID"
          description={user?.id.substring(0, 8) + '...'}
          left={(props) => <List.Icon {...props} icon="identifier" />}
        />
      </View>

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>App</Text>

      <View style={styles.card}>
        <List.Item
          title="Version"
          description="1.0.0 (Beta)"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
      </View>

      <Divider style={styles.divider} />

      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={styles.signOutButton}
        textColor={theme.colors.error}
      >
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
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  halfButton: {
    flex: 1,
  },
  helperText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  divider: {
    marginVertical: theme.spacing.lg,
  },
  signOutButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderColor: theme.colors.error,
  },
});
