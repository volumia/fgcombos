<script lang="ts">
    import { _ } from "svelte-i18n";
    
    type Props = {
        profileName: string;
        description: string | null;
        showEditButton: boolean;
        startEditing: () => void;
    }
    
    let { profileName, description, showEditButton, startEditing }: Props = $props();
</script>

<div class="container">
    <h2>{profileName}</h2>
    <p>{description}</p>

    {#if showEditButton}
        <button class="edit btn-small btn-block" onclick={startEditing}>{$_('common.edit')}</button>
    {/if}
</div>

<style lang="scss">
    @use '@/style/variables' as *;
    
    .container {
        width: 100%;
    }

    .edit {
        margin: $spacing-8 0;
    }
</style>