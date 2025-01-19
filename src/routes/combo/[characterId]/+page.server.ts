import type { PageServerLoad } from './$types';
import { base } from '$app/paths';
import type { Moveset } from '@/moveTypes';
import { error } from '@sveltejs/kit';
import { supabase } from '@/lib/supabase/client';
import { addMessages, locale } from 'svelte-i18n';
import { get } from 'svelte/store';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const lang = get(locale);
    const databasePromise = supabase
        .from('characters')
        .select('moveset, game_name')
        .eq('name', params.characterId);
    const translationFilePromise = fetch(`/locales/characters/${params.characterId}/en.json`);

    const [databaseQuery, getTranslationQuery] = await Promise.all([
        databasePromise,
        translationFilePromise
    ]);

    const localeMessages = await getTranslationQuery.json();
    if (lang) {
        addMessages(lang, localeMessages);
    }

    if (databaseQuery.status !== 200 || databaseQuery.data == undefined) {
        error(404, 'Did not recognize this character ID');
    }

    const moveset: Moveset = databaseQuery.data[0].moveset as Moveset;

    return {
        moveset,
        characterId: params.characterId,
        gameId: databaseQuery.data[0].game_name,
        localeMessages
    };
};
