<script lang="ts">
    import { getProfileContext, setProfileContext } from '@/lib/state/profileContext';
    import type { DBProfile, TypedSupabaseClient } from '@/lib/supabase/databaseTypes';
    import { _ } from 'svelte-i18n';

    type Props = {
        uid: string;
        initDescription: string | null;
        supabase: TypedSupabaseClient;
        close: () => void;
    };

    const localProfile = getProfileContext();
    const props: Props = $props();

    let description = $state(props.initDescription);
    let publishing = $state(false);

    async function saveChanges() {
        publishing = true;

        const { data, error } = await props.supabase
            .from('profiles')
            .update({ description })
            .eq('id', props.uid)
            .select()
            .single();

        if (!error && localProfile != null) {
            localProfile.profile_name = data.profile_name;
            localProfile.description = data.description;
            props.close();
        }

        publishing = false;
    }
</script>

<div class="root">
    <input
        type="text"
        id="description"
        name="description"
        autocomplete="off"
        bind:value={description}
    />

    {#if publishing}
        <button disabled>{$_('common.pending')}</button>
    {:else}
        <button onclick={saveChanges}>{$_('common.save')}</button>
    {/if}
    <button onclick={props.close}>{$_('common.cancel')}</button>
</div>

<style lang="scss">
    .root {
        width: 100%;
    }
</style>
