# Supabase Configuration

Supabase project URL: TBD
Project ID: TBD

## Setup

1. Install Supabase CLI:

```bash
npm install -g supabase
```

2. Login to Supabase:

```bash
supabase login
```

3. Link to project (after creating on Supabase dashboard):

```bash
supabase link --project-ref <project-id>
```

4. Run migrations:

```bash
supabase db push
```

## Local Development

Start local Supabase instance:

```bash
supabase start
```

Stop local instance:

```bash
supabase stop
```

## Migrations

Create a new migration:

```bash
supabase migration new <migration_name>
```

Apply migrations:

```bash
supabase db push
```

Reset database (local):

```bash
supabase db reset
```
