<!--
@component
A wrapper over text-type \<input\>s which also reactively displays validation errors.
-->

<script lang="ts">
    import clsx from 'clsx';
    import { SvelteMap } from 'svelte/reactivity';

    type Props = {
        name: string;
        id: string;
        type: 'text' | 'email' | 'password';
        label: string;
        placeholder?: string;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        className?: string;
        value?: string;
    };

    let { value = $bindable(), ...props }: Props = $props();
    let inputEl: HTMLInputElement | undefined = $state();
    let validationMessage: string | undefined = $state();
    let showValidationMessage: boolean = $state(false);

    const optionalAttrs: SvelteMap<string, any> = new SvelteMap<string, any>();

    export function setCustomValidity(error: string) {
        inputEl?.setCustomValidity(error);
        value = inputEl?.value;
        validationMessage = inputEl?.validationMessage;
    }

    function setInputEl(el: HTMLInputElement) {
        inputEl = el;
    }

    function onInputChange() {
        // Don't show any potential validation errors until the user has typed something.
        // This stops the page from being filled with validation errors the moment the user
        // enters the page, which could somewhat frighten the user.
        showValidationMessage = true;
        value = inputEl?.value;
        validationMessage = inputEl?.validationMessage;
    }

    $effect(() => {
        if (props.minLength) {
            optionalAttrs.set('minlength', props.minLength);
        } else {
            optionalAttrs.delete('minlength');
        }

        if (props.maxLength) {
            optionalAttrs.set('maxlength', props.maxLength);
        } else {
            optionalAttrs.delete('maxlength');
        }

        if (props.maxLength) {
            optionalAttrs.set('pattern', props.pattern);
        } else {
            optionalAttrs.delete('pattern');
        }
    });
</script>

<div>
    <div><label for={props.id}>{props.label}</label></div>
    <input
        use:setInputEl
        oninput={onInputChange}
        oninvalid={onInputChange}
        name={props.name}
        type={props.type}
        id={props.id}
        class={clsx('no-margin', props.className)}
        placeholder={props.placeholder}
        required
        {...optionalAttrs}
    />
    {#if showValidationMessage && validationMessage}
        <p class="msg-error text-sm">{validationMessage}</p>
    {/if}
    <div class="margin-block"></div>
</div>

<style lang="scss">
    @forward './authForm.scss';
</style>
