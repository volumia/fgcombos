import type { LayoutServerLoad } from './$types';
import { error as throwError } from '@sveltejs/kit';
import type { DBProfile } from '@/lib/supabase/databaseTypes';

export const load: LayoutServerLoad = async ({ params, fetch, locals: { supabase, user } }) => {
    const { data: profile, error: fetchProfileError } = await supabase
        .from('profiles')
        .select()
        .eq('profile_name', params.profileName)
        .single();

    if (fetchProfileError) {
        throwError(500);
    }

    const { data: combos, error: fetchCombosError } = await supabase
        .from('combos')
        .select()
        .eq('creator_uid', profile.id)
        .limit(5);

    return {
        profile,
        combos
    };
};
