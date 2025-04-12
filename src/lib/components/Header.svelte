<script lang="ts">
    import type { AuthError, User } from "@supabase/supabase-js";
    import { _ } from "svelte-i18n";
    import type { TypedSupabaseClient } from "../supabase/databaseTypes";
    import { goto } from "$app/navigation";
    import Icon from "@/lib/components/Icon.svelte";
    
    type Props = {
        user: User|null;
        supabase: TypedSupabaseClient;
    };
    
    let { user, supabase }: Props = $props();
    let signOutPromise: Promise<{error: AuthError | null}> | undefined = $state();

    async function signOut() {
        if (!signOutPromise) {
            signOutPromise = supabase.auth.signOut();
            const { error } = await signOutPromise;
            if (error) {
                goto('/auth/error');
            }
            signOutPromise = undefined;
        }
    }
</script>

<header>
    <a href="/"><Icon src="/icons/logo.svg" size={1.25}></Icon></a>
    <div class="side-separator"></div>
    {#if user != null}
        <span>{user.id.slice(0, 8)}</span>
        <button onclick={signOut}>{$_('auth.signOut')}</button>
    {:else}
        <a href="/auth/sign-in">{$_('auth.signIn')}</a>
    {/if}
</header>

<style lang="scss">
    @use '@/style/variables' as *;
    @use '@/style/mixins' as *;

    header {
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
