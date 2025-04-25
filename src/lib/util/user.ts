import { PUBLIC_SUPABASE_AVATAR_URL_BASE } from "$env/static/public";
import avatarDefaultUrl from '$lib/assets/avatars/default.jpg';


export function getFullAvatarUrlOrDefault(shortenedPath: string | null | undefined): string {
    if (shortenedPath) {
        return `${PUBLIC_SUPABASE_AVATAR_URL_BASE}/${shortenedPath}`;
    }
    else {
        return avatarDefaultUrl;
    }
}