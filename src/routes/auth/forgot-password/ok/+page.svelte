<script lang="ts">
    import { _ } from 'svelte-i18n';
</script>

<main>
    <p>{$_('auth.resetPasswordConfirmation')}</p>
    <div><a href="/">{$_('nav.home')}</a></div>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
