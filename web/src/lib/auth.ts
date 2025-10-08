/**
 * Authentication Helper Functions
 * Provides easy-to-use auth methods for the web app
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import type { Provider } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  householdName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up with email and password
 */
export async function signUp(data: SignUpData) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        household_name: data.householdName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return authData;
}

/**
 * Sign in with email and password
 */
export async function signIn(data: SignInData) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw error;
  }

  return authData;
}

/**
 * Sign in with OAuth provider (Google, Apple, etc.)
 */
export async function signInWithOAuth(provider: Provider) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign in with BankID (via Criipto)
 *
 * @param country - 'se' (Sweden), 'no' (Norway), or 'dk' (Denmark)
 */
export async function signInWithBankID(country: 'se' | 'no' | 'dk') {
  const supabase = createClient();

  // Map country to Criipto ACR value
  const acrValues = {
    se: 'urn:grn:authn:se:bankid:same-device', // Swedish BankID
    no: 'urn:grn:authn:no:vipps', // Vipps (Norway)
    dk: 'urn:grn:authn:dk:mitid:low', // MitID (Denmark)
  };

  // TODO: Implement Criipto integration
  // For now, this is a placeholder that will be connected when Criipto is configured

  console.warn('BankID authentication not yet configured. Please set up Criipto credentials.');

  throw new Error('BankID authentication requires Criipto configuration. Please contact support.');
}

/**
 * Sign out
 */
export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Get current session
 */
export async function getSession() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

/**
 * Get current user
 */
export async function getUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    throw error;
  }
}

/**
 * Update password (must be called from reset password page)
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
}

/**
 * Resend confirmation email
 */
export async function resendConfirmation(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }
}
