import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase/client';
import type { QueryData } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/databaseTypes';

type Combo = Database['public']['Tables']['combos']['Row'];

export async function load() {
    const combosQuery = await supabase.from('combos').select();

    const { data, error } = await combosQuery;
    if (error) {
        throw error;
    }

    const combos: Combo[] = data;

    return {
        combos: combos
    };
}
