import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './databaseGeneratedTypes';

export type DBProfile = Database['public']['Tables']['profiles']['Row'];
export type DBCombo = Database['public']['Tables']['combos']['Row'];
export type DBGame = Database['public']['Tables']['games']['Row'];
export type DBCharacter = Database['public']['Tables']['characters']['Row'];
export type TypedSupabaseClient = SupabaseClient<Database>;