/**
 * Category Classifier
 *
 * AI-powered and rule-based categorization of receipt items.
 * Supports both local classification and OpenAI GPT-4 integration.
 */

import type { ProductCategory } from '../types/enums';

/**
 * Category prediction with confidence score
 */
export interface CategoryPrediction {
  category: ProductCategory;
  confidence: number;
  reasoning?: string;
}

/**
 * Item to be categorized
 */
export interface CategorizableItem {
  name: string;
  sku?: string;
  unit_price?: number;
}

/**
 * Rule-based category keywords
 */
const CATEGORY_KEYWORDS: Record<ProductCategory, string[]> = {
  fruits_vegetables: [
    'apple',
    'banana',
    'orange',
    'tomato',
    'potato',
    'onion',
    'carrot',
    'lettuce',
    'cucumber',
    'pepper',
    'broccoli',
    'spinach',
    'fruit',
    'vegetable',
    'salad',
    'äpple',
    'banan',
    'apelsin',
    'tomat',
    'potatis',
    'lök',
    'morot',
    'sallad',
  ],
  meat_fish: [
    'beef',
    'chicken',
    'pork',
    'lamb',
    'turkey',
    'steak',
    'ground',
    'sausage',
    'bacon',
    'ham',
    'fish',
    'salmon',
    'tuna',
    'shrimp',
    'cod',
    'seafood',
    'nötkött',
    'kyckling',
    'fläsk',
    'lamm',
    'kalkon',
    'korv',
    'fisk',
    'lax',
  ],
  dairy_eggs: [
    'milk',
    'cheese',
    'butter',
    'yogurt',
    'cream',
    'egg',
    'dairy',
    'mjölk',
    'ost',
    'smör',
    'yoghurt',
    'grädde',
    'ägg',
  ],
  bread_bakery: [
    'bread',
    'baguette',
    'roll',
    'bagel',
    'muffin',
    'cake',
    'pastry',
    'croissant',
    'bröd',
    'bagett',
    'bulle',
    'kaka',
    'bakverk',
  ],
  frozen: ['frozen', 'ice cream', 'pizza', 'fryst', 'glass'],
  beverages: [
    'water',
    'juice',
    'soda',
    'coffee',
    'tea',
    'drink',
    'vatten',
    'juice',
    'läsk',
    'kaffe',
    'te',
    'dryck',
  ],
  snacks_candy: [
    'chips',
    'crackers',
    'popcorn',
    'nuts',
    'candy',
    'chocolate',
    'snack',
    'godis',
    'choklad',
  ],
  pantry: [
    'rice',
    'pasta',
    'flour',
    'sugar',
    'salt',
    'oil',
    'sauce',
    'spice',
    'ris',
    'mjöl',
    'socker',
    'olja',
    'sås',
    'krydda',
  ],
  household: [
    'paper',
    'towel',
    'tissue',
    'soap',
    'detergent',
    'cleaner',
    'sponge',
    'papper',
    'handduk',
    'tvål',
    'diskmedel',
    'rengöring',
    'svamp',
  ],
  personal_care: [
    'shampoo',
    'toothpaste',
    'deodorant',
    'lotion',
    'cosmetic',
    'razor',
    'schampo',
    'tandkräm',
    'deodorant',
    'kräm',
    'kosmetik',
    'rakhyvel',
  ],
  baby_kids: [
    'diaper',
    'baby food',
    'formula',
    'wipes',
    'baby',
    'infant',
    'blöja',
    'barnmat',
    'modersmjölksersättning',
    'våtservett',
  ],
  pet_supplies: [
    'dog food',
    'cat food',
    'pet food',
    'cat litter',
    'pet',
    'hundmat',
    'kattmat',
    'kattströ',
  ],
  alcohol: [
    'beer',
    'wine',
    'liquor',
    'vodka',
    'whiskey',
    'rum',
    'gin',
    'öl',
    'vin',
    'sprit',
    'vodka',
    'whisky',
  ],
  other: [],
};

/**
 * Classify item using rule-based approach
 */
export function classifyItemByRules(item: CategorizableItem): CategoryPrediction {
  const itemName = item.name.toLowerCase();

  // Score each category based on keyword matches
  const scores: Record<ProductCategory, number> = {} as Record<ProductCategory, number>;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchCount = keywords.filter((keyword) =>
      itemName.includes(keyword.toLowerCase())
    ).length;

    if (matchCount > 0) {
      scores[category as ProductCategory] = matchCount;
    }
  }

  // Find category with highest score
  const categories = Object.entries(scores) as Array<[ProductCategory, number]>;

  if (categories.length === 0) {
    // No matches found, return OTHER
    return {
      category: 'other',
      confidence: 0.3,
      reasoning: 'No keyword matches found',
    };
  }

  // Sort by score descending
  categories.sort((a, b) => b[1] - a[1]);

  const [bestCategory, bestScore] = categories[0];
  const totalScore = categories.reduce((sum, [, score]) => sum + score, 0);

  // Calculate confidence (0-1 scale)
  const confidence = Math.min(bestScore / totalScore, 0.95);

  return {
    category: bestCategory,
    confidence,
    reasoning: `Matched ${bestScore} keyword(s)`,
  };
}

/**
 * Classify multiple items
 */
export function classifyItems(items: CategorizableItem[]): CategoryPrediction[] {
  return items.map((item) => classifyItemByRules(item));
}

/**
 * OpenAI GPT-4 categorization request
 */
export interface GPTCategorizationRequest {
  items: Array<{
    name: string;
    sku?: string;
    unit_price?: number;
  }>;
  store_name?: string;
  country?: string;
}

/**
 * OpenAI GPT-4 categorization response
 */
export interface GPTCategorizationResponse {
  categorizations: Array<{
    item_name: string;
    category: ProductCategory;
    confidence: number;
    reasoning: string;
  }>;
}

/**
 * All available product categories
 */
const ALL_CATEGORIES: ProductCategory[] = [
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
 * Build prompt for GPT-4 categorization
 */
export function buildGPTCategorizationPrompt(request: GPTCategorizationRequest): string {
  const categories = ALL_CATEGORIES.join(', ');

  const itemsList = request.items
    .map((item, i) => `${i + 1}. ${item.name}${item.sku ? ` (SKU: ${item.sku})` : ''}`)
    .join('\n');

  return `You are a grocery item categorization expert. Categorize the following items from a grocery receipt into one of these categories: ${categories}.

Store: ${request.store_name || 'Unknown'}
Country: ${request.country || 'Sweden'}

Items to categorize:
${itemsList}

For each item, provide:
1. The item name (exactly as given)
2. The most appropriate category
3. A confidence score (0.0 to 1.0)
4. Brief reasoning

Respond ONLY with a JSON object in this format:
{
  "categorizations": [
    {
      "item_name": "Item name",
      "category": "CATEGORY_NAME",
      "confidence": 0.95,
      "reasoning": "Brief explanation"
    }
  ]
}`;
}

/**
 * Parse GPT-4 categorization response
 */
export function parseGPTCategorizationResponse(responseText: string): GPTCategorizationResponse {
  try {
    // Extract JSON from markdown code blocks if present
    let jsonText = responseText.trim();

    // Remove markdown code blocks
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1];
    }

    const response = JSON.parse(jsonText) as GPTCategorizationResponse;

    // Validate response structure
    if (!response.categorizations || !Array.isArray(response.categorizations)) {
      throw new Error('Invalid response structure: missing categorizations array');
    }

    // Validate each categorization
    response.categorizations.forEach((cat, index) => {
      if (!cat.item_name || !cat.category) {
        throw new Error(`Invalid categorization at index ${index}: missing required fields`);
      }

      // Validate category is a valid ProductCategory
      if (!ALL_CATEGORIES.includes(cat.category)) {
        throw new Error(`Invalid category at index ${index}: ${cat.category}`);
      }

      // Validate confidence score
      if (typeof cat.confidence !== 'number' || cat.confidence < 0 || cat.confidence > 1) {
        throw new Error(`Invalid confidence score at index ${index}: ${cat.confidence}`);
      }
    });

    return response;
  } catch (error) {
    throw new Error(`Failed to parse GPT categorization response: ${(error as Error).message}`);
  }
}

/**
 * Merge rule-based and GPT-4 predictions
 * Prefers GPT-4 if confidence is high, otherwise uses rules
 */
export function mergePredictions(
  rulePrediction: CategoryPrediction,
  gptPrediction?: CategoryPrediction
): CategoryPrediction {
  // No GPT prediction, use rules
  if (!gptPrediction) {
    return rulePrediction;
  }

  // GPT has high confidence, use it
  if (gptPrediction.confidence >= 0.8) {
    return gptPrediction;
  }

  // Both predictions agree, use GPT (might have better reasoning)
  if (gptPrediction.category === rulePrediction.category) {
    return {
      ...gptPrediction,
      confidence: Math.max(gptPrediction.confidence, rulePrediction.confidence),
    };
  }

  // Predictions disagree, use the one with higher confidence
  if (gptPrediction.confidence > rulePrediction.confidence) {
    return gptPrediction;
  }

  return rulePrediction;
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: ProductCategory, locale: string = 'en'): string {
  const names: Record<ProductCategory, Record<string, string>> = {
    fruits_vegetables: { en: 'Fruits & Vegetables', sv: 'Frukt & Grönt' },
    meat_fish: { en: 'Meat & Fish', sv: 'Kött & Fisk' },
    dairy_eggs: { en: 'Dairy & Eggs', sv: 'Mejeri & Ägg' },
    bread_bakery: { en: 'Bread & Bakery', sv: 'Bröd & Bageri' },
    frozen: { en: 'Frozen Foods', sv: 'Fryst' },
    beverages: { en: 'Beverages', sv: 'Drycker' },
    snacks_candy: { en: 'Snacks & Candy', sv: 'Snacks & Godis' },
    pantry: { en: 'Pantry Staples', sv: 'Skafferi' },
    household: { en: 'Household', sv: 'Hushåll' },
    personal_care: { en: 'Personal Care', sv: 'Personvård' },
    baby_kids: { en: 'Baby & Kids', sv: 'Barn & Baby' },
    pet_supplies: { en: 'Pet Supplies', sv: 'Djurmat' },
    alcohol: { en: 'Alcohol', sv: 'Alkohol' },
    other: { en: 'Other', sv: 'Övrigt' },
  };

  return names[category][locale] || names[category]['en'];
}
