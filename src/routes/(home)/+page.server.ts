import type { PageServerLoad } from './$types';
import type { DBCombo, DBGame } from '@/lib/supabase/databaseTypes';

const maxNumberOfCombos = 5;

export const load: PageServerLoad = async ({locals: { supabase: supabase }}) => {
    const combosQuery = supabase.from('combos').select().limit(maxNumberOfCombos);
    const gamesQuery = supabase.from('games').select();

    const { data: combosData, error: combosError } = await combosQuery;
    if (combosError) {
        throw combosError;
    }
    const { data: gamesData, error: gamesError } = await gamesQuery;
    if (gamesError) {
        throw gamesError;
    }

    const combos: DBCombo[] = combosData;
    const games: DBGame[] = gamesData;

    return {
        combos,
        games
    };
}
