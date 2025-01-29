<script lang="ts">
    import { _ } from 'svelte-i18n';
</script>

<main>
    <h1>{$_('auth.signInGreeting')}</h1>

    <form method="POST" action="?/signIn">
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
        <div class="row-space-between">
            <label for="password">{$_('auth.password')}</label>
            <a href="/auth/forgot-password">{$_('auth.forgotPassword')}</a>
        </div>
        <div><input name="password" type="password" id="password" placeholder={$_('auth.passwordPlaceholder')} required /></div>
        <div><button class="form-action">{$_('auth.signIn')}</button></div>
        <div>
            <span>{$_('auth.noAccount')}</span>
            <a href="/auth/sign-up">{$_('auth.signUpNow')}</a>
        </div>
    </form>
</main>

<style lang="scss">
    @import '../authForm.scss';
</style>
