<script lang="ts">
    import type { User } from "@supabase/supabase-js";
    import { _ } from "svelte-i18n";
    
    let { user }: {user: User|null} = $props();
</script>

<header>
    <a href="/">{$_('nav.home')}</a>
    <div class="side-separator"></div>
    {#if user != null}
        <span>{user.id.slice(0, 8)}</span>
    {:else}
        <a href="/auth">{$_('auth.signIn')}</a>
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
        height: $size-8;
        margin-bottom: $spacing-2;
        padding: $spacing-2;

        background-color: rgb(189, 189, 189);
    }

    .side-separator {
        flex-grow: 1;
    }
</style>
