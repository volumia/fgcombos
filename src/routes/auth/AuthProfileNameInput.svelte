<!--
@component
A wrapper over \<input\> specifically for usernames. 
Checks username validity on the client-side and server-side, and renders any validation errors.
-->

<script lang="ts">
    import { _ } from 'svelte-i18n';
    import clsx from 'clsx';
    import { debounce } from 'lodash-es';
    import { ProfileNameChecker } from './ProfileNameChecker.svelte';
    import Icon from '@/lib/components/Icon.svelte';

    type Props = {
        name: string;
        id: string;
        label: string;
        placeholder?: string;
        minLength: number;
        maxLength: number;
        pattern: string;
        className?: string;
        value?: string;
        nameChecker: ProfileNameChecker;
    };

    let { value = $bindable(), nameChecker, ...props }: Props = $props();
    let inputEl: HTMLInputElement | undefined = $state();
    let validationMessage: string | undefined = $state();

    // Don't want to make a request to the server before the user is finished typing.
    const verifyProfileNameDebounce = debounce(verifyProfileName, 500);

    export function setCustomValidity(error: string) {
        inputEl?.setCustomValidity(error);
        value = inputEl?.value;
        validationMessage = inputEl?.validationMessage;
    }

    async function verifyProfileName() {
        if (!inputEl) return;

        await nameChecker.checkStatus(inputEl);
    }

    function setInputEl(el: HTMLInputElement) {
        inputEl = el;
    }

    function onInputChange() {
        value = inputEl?.value;
        validationMessage = inputEl?.validationMessage;

        inputEl?.setCustomValidity($_('auth.profileNameChecking'));
        verifyProfileNameDebounce();
    }
</script>

<div>
    <div><label for={props.id}>{props.label}</label></div>
    <input
        use:setInputEl
        oninput={onInputChange}
        oninvalid={onInputChange}
        name={props.name}
        type="text"
        id={props.id}
        class={clsx('no-margin', props.className)}
        placeholder={props.placeholder}
        required
        minlength={props.minLength}
        maxlength={props.maxLength}
        pattern={props.pattern}
    />
    {#if nameChecker.valueMissing}
        <p class="msg-error text-sm">{$_('auth.profileNameEmpty')}</p>
    {/if}
    {#if nameChecker.tooLong}
        <p class="msg-error text-sm">
            {$_('auth.profileNameTooLong', { values: { n: props.maxLength + 1 } })}
        </p>
    {/if}
    {#if nameChecker.tooShort}
        <p class="msg-error text-sm">
            {$_('auth.profileNameTooShort', { values: { n: props.minLength - 1 } })}
        </p>
    {/if}
    {#if nameChecker.patternMismatch}
        <p class="msg-error text-sm">{$_('auth.profileNamePatternMismatch')}</p>
    {/if}
    {#if nameChecker.checking}
        <p class="text-sm">{$_('auth.profileNameChecking')}</p>
    {/if}
    {#if !nameChecker.valid && nameChecker.performedAllChecks}
        <p class="msg-error text-sm">{$_('auth.profileNameClaimed')}</p>
    {/if}
    {#if nameChecker.valid && nameChecker.performedAllChecks}
        <p class="msg-valid text-sm">
            <Icon src="/icons/check-circle-outline.svg"></Icon>
            {$_('auth.profileNameUnclaimed')}
        </p>
    {/if}
    <div class="margin-block"></div>
</div>

<style lang="scss">
    @forward './authForm.scss';
</style>
