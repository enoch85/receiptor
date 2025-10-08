// Categorize receipt items using OpenAI GPT-4
// Supabase Edge Function
// Note: This file uses Deno runtime, linting errors are expected in Node.js environment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

interface ReceiptItem {
  name: string;
  price: number;
  quantity?: number;
}

const CATEGORY_DEFINITIONS = `
Categorize grocery items into one of these categories:
- fruits_vegetables: Fresh produce, fruits, vegetables
- meat_fish: All meat, poultry, seafood, and plant-based alternatives
- dairy_eggs: Milk, cheese, yogurt, butter, eggs
- bread_bakery: Bread, rolls, pastries, cakes
- pantry: Dry goods, pasta, rice, flour, canned goods, spices
- frozen: Frozen foods of any kind
- beverages: All drinks (non-alcoholic)
- snacks_candy: Chips, candy, cookies, crackers
- alcohol: Beer, wine, spirits
- household: Cleaning supplies, paper products, kitchen items
- personal_care: Toiletries, cosmetics, hygiene products
- baby_kids: Baby food, diapers, baby care
- pet_supplies: Pet food and supplies
- other: Anything that doesn't fit above

Also identify:
- is_organic: true if product is labeled organic, eco, or similar
- carbon_score: estimate grams of CO2e (use general knowledge)
`;

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    // Check authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid items array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call OpenAI to categorize items
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a grocery item categorization expert. ${CATEGORY_DEFINITIONS}
            
Return a JSON array with the same items, adding: category, is_organic, confidence (0-1), and optional carbon_score.`,
          },
          {
            role: 'user',
            content: `Categorize these grocery items:\n${JSON.stringify(items, null, 2)}`,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent categorization
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to categorize items' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const categorizedItems = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ categorized_items: categorizedItems }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
