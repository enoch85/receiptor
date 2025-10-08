/**
 * ReceiptCard Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ReceiptCard } from '../ReceiptCard';
import { Receipt } from '@receiptor/shared';

describe('ReceiptCard', () => {
  const mockReceipt: Receipt = {
    id: '1',
    household_id: 'test-household',
    store_name: 'ICA Supermarket',
    total_amount: 245.50,
    currency: 'SEK',
    purchase_date: new Date('2025-10-08'),
    source: 'manual',
    created_at: new Date(),
    updated_at: new Date(),
  };

  it('should render receipt details correctly', () => {
    const { getByText } = render(<ReceiptCard receipt={mockReceipt} />);

    expect(getByText('ICA Supermarket')).toBeTruthy();
    expect(getByText('245.50 SEK')).toBeTruthy();
  });

  it('should call onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ReceiptCard receipt={mockReceipt} onPress={onPress} />
    );

    fireEvent.press(getByTestId('receipt-card'));

    expect(onPress).toHaveBeenCalledWith(mockReceipt.id);
  });

  it('should show item count when items exist', () => {
    const receiptWithItems = {
      ...mockReceipt,
      items: [
        { id: '1', name: 'Milk', total_price: 29.99 },
        { id: '2', name: 'Bread', total_price: 25 },
      ],
    } as any;

    const { getByText } = render(<ReceiptCard receipt={receiptWithItems} />);

    expect(getByText('2 items')).toBeTruthy();
  });

  it('should format dates correctly', () => {
    const { getByText } = render(<ReceiptCard receipt={mockReceipt} />);

    // Should show formatted date (e.g., "Oct 8")
    const dateElement = getByText(/Oct|October/);
    expect(dateElement).toBeTruthy();
  });
});
