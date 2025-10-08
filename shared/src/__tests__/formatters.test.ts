import { formatCurrency, formatDate, snakeToTitle } from '../utils/formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format SEK currency', () => {
      const result = formatCurrency(1234.56, 'SEK', 'sv-SE');
      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('56');
    });

    it('should format USD currency', () => {
      const result = formatCurrency(1234.56, 'USD', 'en-US');
      expect(result).toContain('1,234.56');
    });
  });

  describe('formatDate', () => {
    it('should format date', () => {
      const date = new Date('2025-10-08');
      const result = formatDate(date, 'en-US');
      expect(result).toContain('October');
      expect(result).toContain('8');
      expect(result).toContain('2025');
    });
  });

  describe('snakeToTitle', () => {
    it('should convert snake_case to Title Case', () => {
      expect(snakeToTitle('meat_fish')).toBe('Meat Fish');
      expect(snakeToTitle('fruits_vegetables')).toBe('Fruits Vegetables');
    });
  });
});
