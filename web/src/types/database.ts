/**
 * Supabase Database Types
 * Auto-generated from database schema
 *
 * To regenerate: npx supabase gen types typescript --local > src/types/database.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      households: {
        Row: {
          id: string;
          name: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      household_members: {
        Row: {
          id: string;
          household_id: string;
          user_id: string;
          role: 'admin' | 'member' | 'viewer';
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          user_id: string;
          role?: 'admin' | 'member' | 'viewer';
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          user_id?: string;
          role?: 'admin' | 'member' | 'viewer';
          created_at?: string;
        };
      };
      receipts: {
        Row: {
          id: string;
          household_id: string;
          uploaded_by: string;
          store_name: string | null;
          total_amount: number;
          currency: string;
          purchase_date: string;
          image_url: string | null;
          raw_ocr_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          uploaded_by: string;
          store_name?: string | null;
          total_amount: number;
          currency?: string;
          purchase_date: string;
          image_url?: string | null;
          raw_ocr_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          uploaded_by?: string;
          store_name?: string | null;
          total_amount?: number;
          currency?: string;
          purchase_date?: string;
          image_url?: string | null;
          raw_ocr_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          household_id: string;
          amount: number;
          currency: string;
          period: 'weekly' | 'monthly' | 'yearly';
          start_date: string;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          amount: number;
          currency?: string;
          period: 'weekly' | 'monthly' | 'yearly';
          start_date: string;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          amount?: number;
          currency?: string;
          period?: 'weekly' | 'monthly' | 'yearly';
          start_date?: string;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
