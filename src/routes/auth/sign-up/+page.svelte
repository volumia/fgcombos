<script lang="ts">
    import { _ } from 'svelte-i18n';
    import type { PageData } from './$types';
    import { getCheckerCssClass, ProfileNameChecker } from '../ProfileNameChecker.svelte';
    import { authConstants } from '../authConstants';
    import AuthInput from '../AuthInput.svelte';
    import AuthProfileNameInput from '../AuthProfileNameInput.svelte';

    let { data }: { data: PageData } = $props();

    let profileNameChecker = $state(new ProfileNameChecker(data.supabase));

    let password1: string | undefined = $state();
    let password2: string | undefined = $state();
    let password1Input: AuthInput | undefined = $state();
    let password2Input: AuthInput | undefined = $state();

    function preventDefaultValidationPopup(e: Event) {
        // Prevents the default HTML validation popup when submitting an invalidated form 
        // (assuming e is from an 'invalid' event, naturally)
        // Client-side validation still occurs.
        e.preventDefault();
    }

    function onFormMounted(form: HTMLFormElement) {
        $effect(() => {
            form.addEventListener('invalid', preventDefaultValidationPopup, true);

            return () => form.removeEventListener('invalid', preventDefaultValidationPopup, true);
        });
    }

    // Ensure the first password and the confirmation password are equal.
    $effect(() => {
        if (password1 === password2) {
            password1Input?.setCustomValidity('');
            password2Input?.setCustomValidity('');
        } else {
            password2Input?.setCustomValidity($_('auth.errorPasswordsDontMatch'));
        }
    });
</script>

<main>
    <h1>{$_('auth.signUpGreeting')}</h1>

    <form method="POST" action="?/signUp" use:onFormMounted>
        <AuthProfileNameInput
            name="profileName"
            id="profileName"
            label={$_('auth.profileName')}
            className={getCheckerCssClass(profileNameChecker)}
            placeholder={$_('auth.profileNamePlaceholder')}
            minLength={authConstants.nameMinLength}
            maxLength={authConstants.nameMaxLength}
            pattern={authConstants.nameAllowedPattern}
            nameChecker={profileNameChecker}
        ></AuthProfileNameInput>

        <AuthInput
            name="email"
            type="email"
            id="email"
            label={$_('auth.email')}
            placeholder={$_('auth.emailPlaceholder')}
        ></AuthInput>

        <AuthInput
            name="password"
            type="password"
            id="password"
            label={$_('auth.password')}
            placeholder={$_('auth.passwordPlaceholder')}
            bind:value={password1}
            bind:this={password1Input}
        ></AuthInput>

        <AuthInput
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            label={$_('auth.password')}
            placeholder={$_('auth.passwordPlaceholder')}
            bind:value={password2}
            bind:this={password2Input}
        ></AuthInput>

        <div><button class="form-action">{$_('auth.signUp')}</button></div>
    </form>
</main>

<style lang="scss">
    @forward '../authForm.scss';
</style>
