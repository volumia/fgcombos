<script lang="ts">
    import { _ } from "svelte-i18n";
    
    type Props = {
        description: string | null;
        showEditButton: boolean;
        startEditing: () => void;
    }
    
    let { description, showEditButton, startEditing }: Props = $props();
</script>

<div class="root">
    {#if showEditButton}
        <button onclick={startEditing}>{$_('common.edit')}</button>
    {/if}
    <p>{description}</p>
</div>

<style lang="scss">
    .root {
        width: 100%;
    }
</style>