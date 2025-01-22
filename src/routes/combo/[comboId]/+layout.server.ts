import type { LayoutServerLoad } from './$types';
import type { Moveset } from '@/moveTypes';
import { error } from '@sveltejs/kit';
import { supabase } from '@/lib/supabase/client';

export const load: LayoutServerLoad = async ({ params, fetch }) => {
    const getComboPromise = supabase.from('combos').select().eq('id', params.comboId);

    const getComboQuery = await getComboPromise;

    if (getComboQuery.data == undefined) {
        error(404);
    }

    const combo = getComboQuery.data[0];

    if (combo.character_name == undefined || combo.game_name == undefined) {
        error(404);
    }

    const getLocaleDictPromise = fetch(`/locales/characters/${combo.character_name}/en.json`);
    const getCharacterPromise = supabase
        .from('characters')
        .select('moveset')
        .eq('name', combo.character_name);

    const [localeDictResponse, characterResponse] = await Promise.all([
        getLocaleDictPromise,
        getCharacterPromise
    ]);
    const localeDict = await localeDictResponse.json();

    if (characterResponse.data == undefined) {
        error(404);
    }

    const moveset: Moveset = characterResponse.data[0].moveset as Moveset;

    return {
        characterId: combo.character_name,
        gameId: combo.game_name,
        combo,
        moveset,
        localeDict,
        hasEditPermissions: false
    };
};
