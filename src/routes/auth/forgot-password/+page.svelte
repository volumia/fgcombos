<script lang="ts">
    import { _ } from 'svelte-i18n';
</script>

<main>
    <h1>{$_('auth.resetPasswordGreeting')}</h1>

    <form method="POST" action="?/resetPassword">
        <div><label for="email">{$_('auth.email')}</label></div>
        <div>
            <input
                name="email"
                type="email"
                id="email"
                placeholder={$_('auth.emailPlaceholder')}
                required
            />
        </div>

        <div><button class="form-action">{$_('auth.resetPassword')}</button></div>
    </form>
</main>

<style lang="scss">
    @forward '../authForm.scss';
</style>
