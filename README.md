# E-commerce Store - PostHog Integration Starter

A fully functional e-commerce store built with Next.js 15, TypeScript, Tailwind CSS, and Supabase. This starter app is designed for learning metrics-driven development with PostHog integration.

## Features

- **Product Catalog**: Browse products organized by categories (Electronics, Clothing, Books)
- **Shopping Cart**: Add items to cart, update quantities, and remove items
- **Checkout Flow**: Complete purchase with customer information
- **Category Filtering**: Filter products by category
- **Stock Management**: Real-time stock availability tracking
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase**: Open-source Firebase alternative for database

## Database Schema

### Tables

- **categories**: Product categories
- **products**: Product catalog with pricing and stock
- **cart_items**: Shopping cart items by session

## Getting Started

### Prerequisites

- **Node.js 18+** installed
- **npm** installed

### Setup Options

You can run this app with either **local Supabase** (requires Docker) or **cloud Supabase** (no Docker needed).

---

### Option 1: Local Development with Supabase (Recommended for Learning)

**Additional Requirements:**
- **Docker Desktop** running ([Download Docker](https://www.docker.com/products/docker-desktop))
- **Supabase CLI** ([Install Guide](https://supabase.com/docs/guides/cli))

**Steps:**

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Make sure Docker Desktop is running**

3. **Start Supabase locally**:
   ```bash
   npx supabase start
   ```

   This will:
   - Download Supabase Docker images (first time only)
   - Start a local Supabase instance
   - Run migrations automatically
   - Seed the database with sample products

   **Important:** Copy these from the output:
   - `API URL` (e.g., `http://127.0.0.1:54321`)
   - `Publishable key` (starts with `sb_publishable_...`)

   The "Publishable key" is what you'll use as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local`

4. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   The default values in `.env.local` should work with local Supabase.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

**Useful local commands:**
```bash
npx supabase status         # Check if Supabase is running
npx supabase stop           # Stop Supabase
npx supabase db reset       # Reset database and re-run migrations
npx supabase studio         # Open Supabase Studio (database UI)
```

---

### Option 2: Cloud Supabase (No Docker Required)

**Steps:**

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create a Supabase cloud project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up and create a new project
   - Wait for the project to be ready (~2 minutes)

3. **Get your API credentials**:
   - In your Supabase project, go to **Settings** > **API**
   - Copy the **Project URL** and **anon/public key**

4. **Run the database migration**:
   - In Supabase, go to **SQL Editor**
   - Click **New Query**
   - Copy and paste the contents of `supabase/migrations/20240101000000_initial_schema.sql`
   - Click **Run** to create tables and seed data

5. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and update with your cloud credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

### Quick Start Summary

```bash
# Clone and install
cd ecommerce-store
npm install

# For LOCAL (with Docker):
npx supabase start
cp .env.example .env.local
npm run dev

# For CLOUD (no Docker):
# 1. Create project at supabase.com
# 2. Run migration from SQL Editor
# 3. Update .env.local with your credentials
npm run dev
```

## PostHog Integration Ideas

This app is ready for PostHog integration. Here are some key events to track:

### Key Events to Track

- `product_viewed`: When a user views a product detail page
- `add_to_cart`: When a user adds an item to cart
- `cart_updated`: When cart quantity changes
- `checkout_started`: When user proceeds to checkout
- `order_completed`: When order is confirmed

### Useful Properties

- Product ID, name, price, category
- Cart total value
- Number of items in cart
- User session data

### Example Implementation

```typescript
// In your component
import posthog from 'posthog-js'

// Track product view
posthog.capture('product_viewed', {
  product_id: product.id,
  product_name: product.name,
  price: product.price,
  category: product.category
})
```

## Project Structure

```
ecommerce-store/
├── app/
│   ├── api/cart/          # Cart API routes
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout flow
│   ├── products/[id]/     # Product detail pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (product listing)
├── lib/
│   └── supabase.ts        # Supabase client
├── supabase/
│   ├── config.toml        # Supabase configuration
│   └── migrations/        # Database migrations
└── package.json
```

## Sample Data

The app comes pre-seeded with:
- 3 product categories
- 15 products across all categories
- Realistic product images from Unsplash

## Development Tips

1. **Viewing the database**: Run `supabase studio` to open the Supabase Studio UI
2. **Resetting data**: Run `supabase db reset` to reset the database and re-run migrations
3. **Adding new migrations**: Create new files in `supabase/migrations/`

## Next Steps

1. Install and configure PostHog
2. Add event tracking to key user actions
3. Create dashboards to monitor conversion funnels
4. Experiment with A/B testing different UI variations
5. Set up session recording to understand user behavior

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostHog Documentation](https://posthog.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
