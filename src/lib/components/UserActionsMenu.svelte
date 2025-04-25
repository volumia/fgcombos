<script lang="ts">
    import { _ } from 'svelte-i18n';
    import Avatar from './Avatar.svelte';

    type Props = {
        userName: string;
        avatarUrl: string;
        onSignOut: () => void;
        closeMenu: () => void;
    };

    const { userName, avatarUrl, onSignOut, closeMenu }: Props = $props();

    function signOut() {
        onSignOut();
        closeMenu();
    }
</script>

<div class="actions-menu">
    <a href={`/u/${userName}`} onclick={closeMenu} class="view-profile-button as-button btn-block">
        <Avatar src={avatarUrl} size={2.5}></Avatar>
        <div class="text-stack">
            <p class="view-profile">{$_('user.actions.viewProfile')}</p>
            <p class="profile-name">{userName}</p>
        </div>
    </a>
    <button class="btn-block" onclick={signOut}>{$_('auth.signOut')}</button>
</div>

<style lang="scss">
    @use '@/style/variables' as *;

    .actions-menu {
        position: absolute;
        right: 0;
        top: 100%;

        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;

        width: $size-24;
        min-height: $size-4;
        padding: 0 $spacing-2;

        background-color: $clr-mono20;
        border: 1px solid $clr-mono30;
        border-radius: 0 0 0 $rounded-md;

        z-index: 10;
    }

    button,
    .as-button {
        width: 100%;
        height: $size-6;
    }

    .view-profile-button {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .text-stack {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        flex-grow: 1;
    }

    .view-profile {
        font-size: 0.8em;
        color: $clr-mono20;
    }

    .profile-name {
        color: $clr-mono10;
    }
</style>
