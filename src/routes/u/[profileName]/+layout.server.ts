import type { LayoutServerLoad } from './$types';
import { error as throwError } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, parent, locals: { supabase, user } }) => {
    const { data: pageProfile, error: fetchProfileError } = await supabase
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
        .eq('creator_uid', pageProfile.id)
        .limit(5);

    return {
        pageProfile,
        combos
    };
};
