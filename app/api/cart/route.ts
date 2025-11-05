import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Get or create a session ID for the cart
async function getSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
  }

  return sessionId;
}

export async function GET() {
  const sessionId = await getSessionId();

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('session_id', sessionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: cartItems || [] });
}

export async function POST(request: NextRequest) {
  const sessionId = await getSessionId();
  const { product_id, quantity } = await request.json();

  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', product_id)
    .single();

  let result;

  if (existing) {
    // Update quantity
    result = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select();
  } else {
    // Insert new item
    result = await supabase
      .from('cart_items')
      .insert({ session_id: sessionId, product_id, quantity })
      .select();
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('session_id', sessionId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export async function PATCH(request: NextRequest) {
  const { cart_item_id, quantity } = await request.json();

  if (quantity <= 0) {
    // Delete if quantity is 0 or less
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cart_item_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cart_item_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartItemId = searchParams.get('id');

  if (!cartItemId) {
    return NextResponse.json({ error: 'Missing cart item ID' }, { status: 400 });
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
