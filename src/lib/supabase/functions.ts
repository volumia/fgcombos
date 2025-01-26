import type { Database } from './databaseGeneratedTypes';
import { userState } from './store.svelte';

type DBCombo = Database['public']['Tables']['combos']['Row'];

export async function createCombo(gameId: string, characterId: string): Promise<DBCombo | undefined> {
    const db = userState.db;
    const user = userState.user;

    if (db && user) {
        const comboResponse = await db
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
