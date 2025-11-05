-- Create categories table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id BIGINT NOT NULL REFERENCES categories(id),
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_cart_items_session ON cart_items(session_id);

-- Insert seed data for categories
INSERT INTO categories (name, slug) VALUES
  ('Electronics', 'electronics'),
  ('Clothing', 'clothing'),
  ('Books', 'books');

-- Insert seed data for products
INSERT INTO products (name, description, price, category_id, image_url, stock) VALUES
  -- Electronics
  ('Wireless Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 199.99, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 25),
  ('Smart Watch', 'Fitness tracking smartwatch with heart rate monitor and GPS', 299.99, 1, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 15),
  ('Bluetooth Speaker', 'Portable waterproof speaker with 360-degree sound', 79.99, 1, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 40),
  ('Laptop Stand', 'Ergonomic aluminum laptop stand with adjustable height', 49.99, 1, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 50),
  ('USB-C Hub', 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader', 39.99, 1, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500', 60),

  -- Clothing
  ('Classic White T-Shirt', 'Comfortable cotton t-shirt in classic white', 24.99, 2, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 100),
  ('Denim Jeans', 'Slim fit denim jeans with stretch fabric', 69.99, 2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 45),
  ('Leather Jacket', 'Genuine leather jacket with quilted lining', 299.99, 2, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 8),
  ('Running Shoes', 'Lightweight running shoes with cushioned sole', 89.99, 2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 30),
  ('Cotton Hoodie', 'Soft cotton blend hoodie with kangaroo pocket', 49.99, 2, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 55),

  -- Books
  ('The Design of Everyday Things', 'Classic book on design principles and user experience', 19.99, 3, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 20),
  ('Clean Code', 'A handbook of agile software craftsmanship', 34.99, 3, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', 35),
  ('Atomic Habits', 'An easy and proven way to build good habits', 16.99, 3, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500', 42),
  ('Thinking, Fast and Slow', 'Groundbreaking tour of the mind by Nobel Prize winner', 18.99, 3, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', 28),
  ('The Lean Startup', 'How constant innovation creates radically successful businesses', 22.99, 3, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', 33);
