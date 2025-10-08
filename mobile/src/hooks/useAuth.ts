/**
 * Authentication Hook
 *
 * Provides authentication state and methods throughout the app.
 * Listens to Supabase auth state changes and updates UI accordingly.
 */

import type { User, Session, AuthError } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { supabase } from '../services/supabase';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

/**
 * Hook for authentication state and operations
 *
 * @example
 * ```tsx
 * function LoginScreen() {
 *   const { signIn, loading } = useAuth();
 *
 *   const handleLogin = async () => {
 *     const { error } = await signIn(email, password);
 *     if (error) {
 *       Alert.alert('Error', error.message);
 *     }
 *   };
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
