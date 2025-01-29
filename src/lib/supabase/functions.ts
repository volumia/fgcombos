import type { Database } from './databaseGeneratedTypes';
import { userState } from './store.svelte';

type DBCombo = Database['public']['Tables']['combos']['Row'];

export async function createCombo(gameId: string, characterId: string): Promise<DBCombo | undefined> {
    const sb = userState.supabase;
    const user = userState.user;

    if (sb && user) {
        const comboResponse = await sb
            .from('combos')
            .insert({
                creator_uid: user.id,
                game_name: gameId,
                character_name: characterId,
                damage: 0,
                title: 'New combo',
                like_count: 0
            } as DBCombo)
            .select();

        if (comboResponse.error) {
            throw comboResponse.error;
        }
            
        if (comboResponse.data) {
            return comboResponse.data[0];
        }
    }

    return undefined;
}
