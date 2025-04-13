import { isBrowser, createBrowserClient, createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { browser } from '$app/environment';
import { locale, waitLocale } from 'svelte-i18n';
import '@/i18n/index';
import type { LayoutLoad } from './$types';
import type { Database } from '@/lib/supabase/databaseGeneratedTypes';
import type { DBProfile } from '@/lib/supabase/databaseTypes';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
    /**
     * Declare a dependency so the layout can be invalidated, for example, on
     * session refresh.
     */
    depends('supabase:auth');

    const supabase = isBrowser()
        ? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
              global: {
                  fetch
              }
          })
        : createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
              global: {
                  fetch
              },
              cookies: {
                  getAll() {
                      return data.cookies;
                  }
              }
          });

    /**
     * It's fine to use `getSession` here, because on the client, `getSession` is
     * safe, and on the server, it reads `session` from the `LayoutData`, which
     * safely checked the session using `safeGetSession`.
     */
    const {
        data: { session }
    } = await supabase.auth.getSession();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    let profile: DBProfile | null = null;
    if (user && user.id) {
        const {
            data: matchingProfile
        } = await supabase.from('profiles').select('*').eq('id', user.id).single();

        profile = matchingProfile;
    }

    if (browser) {
        locale.set(window.navigator.language);
    }

    await waitLocale();

    return { session, supabase, user, profile };
};
