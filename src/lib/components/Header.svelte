<script lang="ts">
    import type { AuthError, User } from '@supabase/supabase-js';
    import { _ } from 'svelte-i18n';
    import type { TypedSupabaseClient } from '../supabase/databaseTypes';
    import { goto, invalidateAll } from '$app/navigation';
    import Icon from '@/lib/components/Icon.svelte';
    import UserActionsMenu from './UserActionsMenu.svelte';
    import Avatar from './Avatar.svelte';
    import avatarDefaultUrl from '$lib/assets/avatars/default.jpg';
    import { getProfileContext } from '../state/profileContext';

    type Props = {
        user: User | null;
        supabase: TypedSupabaseClient;
    };

    let { user, supabase }: Props = $props();
    let profile = getProfileContext();
    let signOutPromise: Promise<{ error: AuthError | null }> | undefined = $state();

    let showActionsMenu = $state(false);

    async function signOut() {
        if (!signOutPromise) {
            signOutPromise = supabase.auth.signOut();

            const { error } = await signOutPromise;
            if (error) {
                goto('/auth/error');
            }

            signOutPromise = undefined;
            showActionsMenu = false;

            invalidateAll();
        }
    }

    function toggleActionsMenu() {
        showActionsMenu = !showActionsMenu;
    }
</script>

<header>
    <a href="/"><Icon src="/icons/logo.svg" size={1.25}></Icon></a>
    <div class="side-separator"></div>
    {#if user != null}
        <button onclick={toggleActionsMenu} class="content-only">
            <Avatar size={2}></Avatar>
        </button>
    {:else}
        <a href="/auth/sign-in">{$_('auth.signIn')}</a>
    {/if}

    {#if showActionsMenu && profile && user}
        <UserActionsMenu
            userName={profile.profile_name}
            avatarUrl={avatarDefaultUrl}
            onSignOut={signOut}
            closeMenu={toggleActionsMenu}
        ></UserActionsMenu>
    {/if}
</header>

<style lang="scss">
    @use '@/style/variables' as *;
    @use '@/style/mixins' as *;

    header {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;

        width: 100%;
        height: $size-6;
        margin-bottom: $spacing-2;
        padding: $spacing-2;
        gap: $spacing-4;

        background-color: $clr-mono10;
        border-bottom: 1px solid $clr-mono20;
    }

    .side-separator {
        flex-grow: 1;
    }

    a {
        color: $clr-mono100;

        &:visited {
            color: $clr-mono100;
        }
    }
</style>
