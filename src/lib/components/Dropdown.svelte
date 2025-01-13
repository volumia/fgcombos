<script lang="ts" generics="DropdownValue">
    import { _ } from "svelte-i18n";
    import clsx from "clsx";

    type DropdownOption = {
        value: DropdownValue;
        text: string;
    };

    type Props = {
        options: DropdownOption[];
        value?: DropdownValue;
        initialIndex?: number;
        placeholder?: string;
        disabled?: boolean;
    };

    let {
        options,
        value: selectedValue = $bindable(),
        initialIndex,
        placeholder,
        disabled = false
    }: Props = $props();

    if (initialIndex != undefined) {
        selectedValue = options[initialIndex].value;
    }

    function onChange(e: Event) {
        const el = e.target as HTMLSelectElement;
        // Subtract the selectedIndex by 1 because the placeholder option is at index 0.
        selectedValue = options[el.selectedIndex - 1].value;
    }
</script>

<div class="select-wrapper">
    <select
        class={clsx(selectedValue == undefined && "placeholder")}
        onchange={onChange}
        {disabled}
    >
        <option class="placeholder" value="" disabled selected={initialIndex == undefined} hidden
            >{$_(placeholder || "")}
        </option>

        {#each options as option, i}
            <option value={i} selected={initialIndex === i}>
                {$_(option.text)}
            </option>
        {/each}
    </select>
</div>

<style lang="scss">
    .select-wrapper {
        $border: black;

        width: 30ch;

        border: 1px solid $border;

        font-size: 1rem;
        line-height: 1.2em;
        cursor: pointer;

        select {
            -moz-appearance: none;
            -webkit-appearance: none;
            appearance: none;

            width: 100%;
            padding-top: 0.1em;
            padding-bottom: 0.1em;
            padding-inline-start: 0;
            padding-inline-end: 1em;
            margin: 0;

            font-family: inherit;
            font-size: inherit;
            cursor: inherit;
            line-height: inherit;

            background: url("/icons/dropdown-arrow.svg") center right no-repeat;
            border: 0;
            outline: none;

            &:focus {
                outline: 2px solid $border;
            }

            &:disabled {
                cursor: not-allowed;
                background-color: #dadada;
            }
        }

        .placeholder {
            color: rgb(73, 73, 73);
        }
    }
</style>
