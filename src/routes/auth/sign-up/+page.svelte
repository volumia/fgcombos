<script lang="ts">
    import { _ } from 'svelte-i18n';

    let passwordEl: HTMLInputElement | undefined = $state();
    let confirmPasswordEl: HTMLInputElement | undefined = $state();

    function setPasswordEl(el: HTMLInputElement) {
        passwordEl = el;
    }

    function setConfirmPasswordEl(el: HTMLInputElement) {
        confirmPasswordEl = el;
    }

    function confirmPassword(e: Event) {
        const input = e.target as HTMLInputElement;

        if (passwordEl && confirmPasswordEl) {
            if (passwordEl.value === confirmPasswordEl.value) {
                passwordEl.setCustomValidity('');
                confirmPasswordEl.setCustomValidity('');
            } else {
                confirmPasswordEl.setCustomValidity($_('auth.errorPasswordsDontMatch'));
            }
        }
    }
</script>

<main>
    <h1>{$_('auth.signUpGreeting')}</h1>

    <form method="POST" action="?/signUp">
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

        <div><label for="password">{$_('auth.password')}</label></div>
        <div>
            <input
                use:setPasswordEl
                oninput={confirmPassword}
                name="password"
                type="password"
                id="password"
                required
                placeholder={$_('auth.passwordPlaceholder')}
            />
        </div>

        <div><label for="confirmPassword">{$_('auth.confirmPassword')}</label></div>
        <div>
            <input
                use:setConfirmPasswordEl
                oninput={confirmPassword}
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                required
                placeholder={$_('auth.passwordPlaceholder')}
            />
        </div>

        <div><button class="form-action">{$_('auth.signUp')}</button></div>
    </form>
</main>

<style lang="scss">
    @forward '../authForm.scss';
</style>
