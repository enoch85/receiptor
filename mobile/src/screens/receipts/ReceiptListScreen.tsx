/**
 * Receipt List Screen
 *
 * Displays all receipts for the current household.
 * Features pagination, filtering, and search.
 */

import type { Receipt } from '@receiptor/shared';
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, FAB, Searchbar, Chip } from 'react-native-paper';

import { ReceiptCard } from '../../components/common/ReceiptCard';
import { useHousehold } from '../../hooks/useHousehold';
import { useReceipts } from '../../hooks/useReceipts';
import type { ReceiptsStackScreenProps } from '../../types/navigation';
import { theme } from '../../utils/theme';

type Props = ReceiptsStackScreenProps<'ReceiptList'>;

export function ReceiptListScreen({ navigation }: Props) {
  // Get user's household
  const { householdId, isLoading: householdLoading } = useHousehold();

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState<string | undefined>();

  // Fetch receipts
  const { data, isLoading, isError, error, refetch, isRefetching } = useReceipts({
    householdId: householdId || '', // Only fetch if we have a household ID
    page,
    limit: 20,
    searchQuery: searchQuery || undefined,
    storeFilter,
  });

  const receipts = data?.receipts ?? [];
  const hasMore = data?.hasMore ?? false;

  // Show loading if household is loading
  if (householdLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Setting up your household...</Text>
        </View>
      </View>
    );
  }

  // Show error if no household
  if (!householdId) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.errorText}>No household found</Text>
          <Text style={styles.errorSubtext}>Please contact support</Text>
        </View>
      </View>
    );
  }

  const handleAddReceipt = () => {
    navigation.navigate('ReceiptCapture');
  };

  const handleReceiptPress = (receipt: Receipt) => {
    navigation.navigate('ReceiptDetail', { receiptId: receipt.id });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0); // Reset to first page
  };

  const handleClearFilter = () => {
    setStoreFilter(undefined);
    setPage(0);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading && !isRefetching) {
      setPage((prev) => prev + 1);
    }
  };

  const handleRefresh = () => {
    setPage(0);
    refetch();
  };

  const renderReceipt = ({ item }: { item: Receipt }) => (
    <ReceiptCard receipt={item} onPress={handleReceiptPress} />
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading receipts...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.errorText}>Failed to load receipts</Text>
          <Text style={styles.errorSubtext}>{error?.message ?? 'Unknown error'}</Text>
        </View>
      );
    }

    if (searchQuery || storeFilter) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No receipts found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No receipts yet</Text>
        <Text style={styles.emptySubtext}>Tap the + button to add your first receipt</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search receipts..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Active Filters */}
      {storeFilter && (
        <View style={styles.filtersContainer}>
          <Chip mode="outlined" onClose={handleClearFilter} style={styles.filterChip}>
            Store: {storeFilter}
          </Chip>
        </View>
      )}

      {/* Receipt List */}
      <FlatList
        data={receipts}
        renderItem={renderReceipt}
        keyExtractor={(item) => item.id}
        contentContainerStyle={receipts.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      />

      {/* Add Receipt FAB */}
      <FAB icon="plus" style={styles.fab} onPress={handleAddReceipt} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: theme.colors.background,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: theme.colors.surface,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  listContent: {
    paddingVertical: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
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
  },
  footer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
