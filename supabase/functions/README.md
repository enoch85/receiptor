# Supabase Edge Functions

Edge Functions for Receiptor backend logic.

## Functions

### `categorize-receipt`

Categorizes receipt items using AI (OpenAI GPT-4).

**Trigger:** Called when a new receipt is uploaded or items need categorization.

**Input:**

```json
{
  "items": [
    {
      "name": "Organic Milk 1L",
      "price": 18.5
    }
  ]
}
```

**Output:**

```json
{
  "categorized_items": [
    {
      "name": "Organic Milk 1L",
      "category": "dairy_eggs",
      "is_organic": true,
      "confidence": 0.95
    }
  ]
}
```

### `sync-receipts`

Background job to sync receipts from connected stores.

**Trigger:** Scheduled (every 6 hours) or manual trigger.

### `calculate-analytics`

Pre-calculate analytics for households.

**Trigger:** Scheduled (daily) or when new receipts are added.

## Development

```bash
# Serve functions locally
supabase functions serve

# Deploy function
supabase functions deploy categorize-receipt

# View logs
supabase functions logs categorize-receipt
```

## Environment Variables

Set in Supabase dashboard under Settings > Edge Functions:

- `OPENAI_API_KEY`
- `VERYFI_API_KEY`
- `STRIPE_SECRET_KEY`
