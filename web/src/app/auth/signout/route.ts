/**
 * Sign Out Route Handler
 * Handles user logout
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const supabase = createClient();

  // Sign out from Supabase (clears session and cookies)
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Signout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Revalidate the homepage to clear any cached user data
  revalidatePath('/', 'layout');

  // Redirect to homepage
  return NextResponse.redirect(new URL('/', request.url), {
    status: 303,
  });
}
