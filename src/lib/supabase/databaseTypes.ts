import type { Database } from './databaseGeneratedTypes';

export type DBCombo = Database['public']['Tables']['combos']['Row'];
export type DBGame = Database['public']['Tables']['games']['Row'];
export type DBCharacter = Database['public']['Tables']['characters']['Row'];