/**
 * Receipt Card Component
 *
 * Displays a summary of a receipt in a card format
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { format } from 'date-fns';

import type { Receipt } from '@receiptor/shared';
import { theme } from '../../utils/theme';

interface ReceiptCardProps {
  receipt: Receipt;
  onPress: (receipt: Receipt) => void;
}

/**
 * Format currency amount
 */
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Receipt Card Component
 */
export function ReceiptCard({ receipt, onPress }: ReceiptCardProps) {
  const handlePress = () => {
    onPress(receipt);
  };

  const itemCount = receipt.items?.length ?? 0;
  const dateStr = format(receipt.purchase_date, 'MMM d, yyyy');
  const amountStr = formatCurrency(receipt.total_amount, receipt.currency);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.storeName}>{receipt.store_name}</Text>
              {receipt.store_location && (
                <Text style={styles.location}>{receipt.store_location}</Text>
              )}
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.amount}>{amountStr}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.date}>{dateStr}</Text>
            <Text style={styles.itemCount}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {receipt.source === 'manual' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Manual</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  location: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  amount: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  itemCount: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.tertiary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.surface,
  },
});
