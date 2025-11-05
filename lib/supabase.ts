import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          description: string;
          price: number;
          category_id: number;
          image_url: string;
          stock: number;
          created_at: string;
        };
      };
      cart_items: {
        Row: {
          id: number;
          session_id: string;
          product_id: number;
          quantity: number;
          created_at: string;
        };
      };
    };
  };
};
