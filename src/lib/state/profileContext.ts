import {getContext, setContext} from 'svelte';
import type { DBProfile } from '$lib/supabase/databaseTypes';

type ContextType = DBProfile | null;
const key = 'userProfile';

export function setProfileContext(profile: DBProfile | null) {
    setContext(key, profile);
}

export function getProfileContext() {
    return getContext(key) as ContextType;
}