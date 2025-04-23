<script lang="ts">
    import type { PageData } from './$types';
    import { _ } from 'svelte-i18n';
    import AuthInput from '../AuthInput.svelte';
    import { goto } from '$app/navigation';

    let { data }: { data: PageData } = $props();

    let password1: string | undefined = $state();
    let password2: string | undefined = $state();
    let password1Input: AuthInput | undefined = $state();
    let password2Input: AuthInput | undefined = $state();
    let sentUpdateRequest: boolean = $state(false);

    function preventDefaultValidationPopup(e: Event) {
        // Prevents the default HTML validation popup when submitting an invalidated form
        // (assuming e is from an 'invalid' event, naturally)
        // Client-side validation still occurs.
        e.preventDefault();
    }

    async function updatePassword(e: Event) {
        e.preventDefault();
        if (password1 != undefined && !sentUpdateRequest) {
            sentUpdateRequest = true;

            const { error } = await data.supabase.auth.updateUser({
                password: password1
            });

            if (error) {
                goto('/auth/error');
            } else {
                goto('/');
            }
        }
    }

    function onFormMounted(form: HTMLFormElement) {
        $effect(() => {
            form.addEventListener('invalid', preventDefaultValidationPopup, true);
            form.addEventListener('submit', updatePassword);

            return () => {
                form.removeEventListener('invalid', preventDefaultValidationPopup, true);
                form.removeEventListener('submit', updatePassword);
            };
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
    <h1>{$_('auth.updatePasswordGreeting')}</h1>

    <form use:onFormMounted>
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
            label={$_('auth.confirmPassword')}
            placeholder={$_('auth.passwordPlaceholder')}
            bind:value={password2}
            bind:this={password2Input}
        ></AuthInput>

        <div><button class="form-action">{$_('auth.updatePassword')}</button></div>
    </form>
</main>

<style lang="scss">
    @forward '../authForm.scss';
</style>
