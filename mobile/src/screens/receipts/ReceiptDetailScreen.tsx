/**
 * Receipt Detail Screen
 *
 * Displays full receipt details with image, items, and categories.
 * Allows editing categories and deleting the receipt.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, Chip, Card, Menu, IconButton } from 'react-native-paper';
import { format } from 'date-fns';

import type { ReceiptsStackScreenProps } from '../../types/navigation';
import type { ProductCategory } from '@receiptor/shared';
import { theme } from '../../utils/theme';
import {
  useReceipt,
  useDeleteReceipt,
  useUpdateItemCategory,
} from '../../hooks/useReceipts';

type Props = ReceiptsStackScreenProps<'ReceiptDetail'>;

/**
 * Category options for the menu
 */
const CATEGORIES: ProductCategory[] = [
  'fruits_vegetables',
  'meat_fish',
  'dairy_eggs',
  'bread_bakery',
  'pantry',
  'frozen',
  'beverages',
  'snacks_candy',
  'alcohol',
  'household',
  'personal_care',
  'baby_kids',
  'pet_supplies',
  'other',
];

/**
 * Display names for categories
 */
const CATEGORY_LABELS: Record<ProductCategory, string> = {
  fruits_vegetables: 'Fruits & Vegetables',
  meat_fish: 'Meat & Fish',
  dairy_eggs: 'Dairy & Eggs',
  bread_bakery: 'Bread & Bakery',
  pantry: 'Pantry',
  frozen: 'Frozen Foods',
  beverages: 'Beverages',
  snacks_candy: 'Snacks & Candy',
  alcohol: 'Alcohol',
  household: 'Household',
  personal_care: 'Personal Care',
  baby_kids: 'Baby & Kids',
  pet_supplies: 'Pet Supplies',
  other: 'Other',
};

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
 * Receipt Detail Screen Component
 */
export function ReceiptDetailScreen({ navigation, route }: Props) {
  const { receiptId } = route.params;

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const { data: receipt, isLoading, isError, error } = useReceipt(receiptId);
  const deleteReceipt = useDeleteReceipt();
  const updateCategory = useUpdateItemCategory();

  const handleDelete = () => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReceipt.mutateAsync(receiptId);
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                'Error',
                err instanceof Error ? err.message : 'Failed to delete receipt'
              );
            }
          },
        },
      ]
    );
  };

  const handleCategoryChange = async (itemId: string, category: ProductCategory) => {
    setMenuVisible(false);
    setEditingItemId(null);

    try {
      await updateCategory.mutateAsync({ itemId, category });
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to update category'
      );
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert('Share', 'Share functionality coming soon!');
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading receipt...</Text>
      </View>
    );
  }

  if (isError || !receipt) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load receipt</Text>
        <Text style={styles.errorSubtext}>
          {error?.message ?? 'Unknown error'}
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  const dateStr = format(receipt.purchase_date, 'EEEE, MMMM d, yyyy');
  const timeStr = format(receipt.purchase_date, 'h:mm a');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Receipt Image */}
        {receipt.image_url && (
          <TouchableOpacity activeOpacity={0.9}>
            <Image
              source={{ uri: receipt.image_url }}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {/* Store Information */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.storeName}>{receipt.store_name}</Text>
                {receipt.store_location && (
                  <Text style={styles.location}>{receipt.store_location}</Text>
                )}
              </View>
              {receipt.source === 'manual' && (
                <Chip mode="outlined" style={styles.sourceBadge}>
                  Manual
                </Chip>
              )}
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{dateStr}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{timeStr}</Text>
            </View>

            {receipt.receipt_number && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Receipt #</Text>
                <Text style={styles.value}>{receipt.receipt_number}</Text>
              </View>
            )}

            <View style={styles.separator} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(receipt.total_amount, receipt.currency)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Items List */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Items ({receipt.items.length})</Text>

            {receipt.items.map((item, index) => (
              <View key={item.id}>
                {index > 0 && <View style={styles.itemSeparator} />}

                <View style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemQuantity}>
                        {item.quantity} {item.unit ?? 'x'}
                      </Text>
                      {item.is_organic && (
                        <Chip mode="outlined" compact style={styles.organicChip}>
                          🌱 Organic
                        </Chip>
                      )}
                    </View>

                    {/* Category Chip */}
                    <TouchableOpacity
                      onPress={() => {
                        setEditingItemId(item.id);
                        setMenuVisible(true);
                      }}
                    >
                      <Chip
                        mode="outlined"
                        compact
                        style={styles.categoryChip}
                        icon="tag"
                      >
                        {CATEGORY_LABELS[item.category]}
                      </Chip>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.itemRight}>
                    <Text style={styles.itemPrice}>
                      {formatCurrency(item.total_price, receipt.currency)}
                    </Text>
                    <Text style={styles.itemUnitPrice}>
                      {formatCurrency(item.unit_price, receipt.currency)} each
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            onPress={handleShare}
            style={styles.actionButton}
            icon="share-variant"
          >
            Share
          </Button>

          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.actionButton}
            textColor={theme.colors.error}
            icon="delete"
          >
            Delete
          </Button>
        </View>
      </ScrollView>

      {/* Category Selection Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={() => {
          setMenuVisible(false);
          setEditingItemId(null);
        }}
        anchor={{ x: 0, y: 0 }}
      >
        {CATEGORIES.map((category) => (
          <Menu.Item
            key={category}
            onPress={() => {
              if (editingItemId) {
                handleCategoryChange(editingItemId, category);
              }
            }}
            title={CATEGORY_LABELS[category]}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
  },
  errorSubtext: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.surface,
  },
  card: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  storeName: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  sourceBadge: {
    marginLeft: theme.spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
  },
  totalAmount: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  itemLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  itemName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  itemQuantity: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  organicChip: {
    height: 24,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  itemUnitPrice: {
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.textSecondary,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});
