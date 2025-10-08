/**
 * Category Classifier Tests
 */

import {
  classifyItemByRules,
  classifyItems,
  buildGPTCategorizationPrompt,
  parseGPTCategorizationResponse,
  mergePredictions,
  getCategoryDisplayName,
  type CategorizableItem,
  type GPTCategorizationRequest,
} from '../categorization/category-classifier';

describe('classifyItemByRules', () => {
  it('should classify fruits correctly', () => {
    const item: CategorizableItem = { name: 'Fresh Banana' };
    const result = classifyItemByRules(item);
    expect(result.category).toBe('fruits_vegetables');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should classify meat correctly', () => {
    const item: CategorizableItem = { name: 'Chicken Breast' };
    const result = classifyItemByRules(item);
    expect(result.category).toBe('meat_fish');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should classify dairy correctly', () => {
    const item: CategorizableItem = { name: 'Whole Milk 3%' };
    const result = classifyItemByRules(item);
    expect(result.category).toBe('dairy_eggs');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should classify bread correctly', () => {
    const item: CategorizableItem = { name: 'Fresh Baguette' };
    const result = classifyItemByRules(item);
    expect(result.category).toBe('bread_bakery');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should classify Swedish items correctly', () => {
    const item: CategorizableItem = { name: 'Färsk Mjölk' };
    const result = classifyItemByRules(item);
    expect(result.category).toBe('dairy_eggs');
  });

  it('should return OTHER for unknown items', () => {
    const item: CategorizableItem = { name: 'xyz-unknown-product-123' };
    const result = classifyItemByRules(item);
    expect(result.category).toBe('other');
    expect(result.confidence).toBe(0.3);
  });

  it('should be case insensitive', () => {
    const item1: CategorizableItem = { name: 'BANANA' };
    const item2: CategorizableItem = { name: 'banana' };
    const result1 = classifyItemByRules(item1);
    const result2 = classifyItemByRules(item2);
    expect(result1.category).toBe(result2.category);
  });
});

describe('classifyItems', () => {
  it('should classify multiple items', () => {
    const items: CategorizableItem[] = [{ name: 'Banana' }, { name: 'Milk' }, { name: 'Bread' }];
    const results = classifyItems(items);
    expect(results).toHaveLength(3);
    expect(results[0].category).toBe('fruits_vegetables');
    expect(results[1].category).toBe('dairy_eggs');
    expect(results[2].category).toBe('bread_bakery');
  });
});

describe('buildGPTCategorizationPrompt', () => {
  it('should build prompt with items', () => {
    const request: GPTCategorizationRequest = {
      items: [{ name: 'Banana', sku: 'BAN-001', unit_price: 12.5 }, { name: 'Milk' }],
      store_name: 'ICA',
      country: 'Sweden',
    };
    const prompt = buildGPTCategorizationPrompt(request);

    expect(prompt).toContain('Banana');
    expect(prompt).toContain('Milk');
    expect(prompt).toContain('ICA');
    expect(prompt).toContain('Sweden');
    expect(prompt).toContain('SKU: BAN-001');
    expect(prompt).toContain('JSON');
  });

  it('should handle missing store and country', () => {
    const request: GPTCategorizationRequest = {
      items: [{ name: 'Banana' }],
    };
    const prompt = buildGPTCategorizationPrompt(request);
    expect(prompt).toContain('Unknown');
    expect(prompt).toContain('Sweden'); // Default
  });
});

describe('parseGPTCategorizationResponse', () => {
  it('should parse valid JSON response', () => {
    const responseText = JSON.stringify({
      categorizations: [
        {
          item_name: 'Banana',
          category: 'fruits_vegetables',
          confidence: 0.95,
          reasoning: 'Fruit',
        },
      ],
    });
    const result = parseGPTCategorizationResponse(responseText);
    expect(result.categorizations).toHaveLength(1);
    expect(result.categorizations[0].category).toBe('fruits_vegetables');
  });

  it('should parse JSON in markdown code blocks', () => {
    const responseText =
      '```json\n{"categorizations":[{"item_name":"Milk","category":"dairy_eggs","confidence":0.9,"reasoning":"Dairy"}]}\n```';
    const result = parseGPTCategorizationResponse(responseText);
    expect(result.categorizations).toHaveLength(1);
  });

  it('should throw error for invalid JSON', () => {
    expect(() => parseGPTCategorizationResponse('not json')).toThrow();
  });

  it('should throw error for missing categorizations', () => {
    const responseText = JSON.stringify({ wrong_field: [] });
    expect(() => parseGPTCategorizationResponse(responseText)).toThrow(
      'missing categorizations array'
    );
  });

  it('should throw error for invalid category', () => {
    const responseText = JSON.stringify({
      categorizations: [
        {
          item_name: 'Test',
          category: 'INVALID_CATEGORY',
          confidence: 0.9,
          reasoning: 'Test',
        },
      ],
    });
    expect(() => parseGPTCategorizationResponse(responseText)).toThrow('Invalid category');
  });

  it('should throw error for invalid confidence score', () => {
    const responseText = JSON.stringify({
      categorizations: [
        {
          item_name: 'Test',
          category: 'other',
          confidence: 1.5,
          reasoning: 'Test',
        },
      ],
    });
    expect(() => parseGPTCategorizationResponse(responseText)).toThrow('Invalid confidence score');
  });
});

describe('mergePredictions', () => {
  it('should prefer GPT prediction with high confidence', () => {
    const rulePrediction = {
      category: 'other' as const,
      confidence: 0.3,
    };
    const gptPrediction = {
      category: 'fruits_vegetables' as const,
      confidence: 0.95,
      reasoning: 'Clearly a fruit',
    };
    const result = mergePredictions(rulePrediction, gptPrediction);
    expect(result.category).toBe('fruits_vegetables');
  });

  it('should use rule prediction when GPT is missing', () => {
    const rulePrediction = {
      category: 'dairy_eggs' as const,
      confidence: 0.8,
    };
    const result = mergePredictions(rulePrediction);
    expect(result.category).toBe('dairy_eggs');
  });

  it('should merge when both agree', () => {
    const rulePrediction = {
      category: 'meat_fish' as const,
      confidence: 0.7,
    };
    const gptPrediction = {
      category: 'meat_fish' as const,
      confidence: 0.75,
      reasoning: 'Meat product',
    };
    const result = mergePredictions(rulePrediction, gptPrediction);
    expect(result.category).toBe('meat_fish');
    expect(result.confidence).toBe(0.75); // Max of both
  });

  it('should prefer higher confidence when predictions disagree', () => {
    const rulePrediction = {
      category: 'other' as const,
      confidence: 0.6,
    };
    const gptPrediction = {
      category: 'snacks_candy' as const,
      confidence: 0.5,
    };
    const result = mergePredictions(rulePrediction, gptPrediction);
    expect(result.category).toBe('other');
  });
});

describe('getCategoryDisplayName', () => {
  it('should return English names by default', () => {
    expect(getCategoryDisplayName('fruits_vegetables')).toBe('Fruits & Vegetables');
    expect(getCategoryDisplayName('meat_fish')).toBe('Meat & Fish');
    expect(getCategoryDisplayName('dairy_eggs')).toBe('Dairy & Eggs');
  });

  it('should return Swedish names when locale is sv', () => {
    expect(getCategoryDisplayName('fruits_vegetables', 'sv')).toBe('Frukt & Grönt');
    expect(getCategoryDisplayName('meat_fish', 'sv')).toBe('Kött & Fisk');
    expect(getCategoryDisplayName('dairy_eggs', 'sv')).toBe('Mejeri & Ägg');
  });

  it('should fallback to English for unknown locale', () => {
    expect(getCategoryDisplayName('fruits_vegetables', 'unknown')).toBe('Fruits & Vegetables');
  });
});
