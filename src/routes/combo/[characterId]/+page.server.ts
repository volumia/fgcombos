import type { PageServerLoad } from './$types';
import { base } from '$app/paths';
import type { Moveset } from '@/moveTypes';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const movesetResponse = await fetch(`${base}/data/movesets/${params.characterId}.json`);
    if (!movesetResponse.ok) {
        error(404, 'Did not recognize this character ID');
    }

    const moveset: Moveset = (await movesetResponse.json()) as Moveset;

    return { moveset };
};
