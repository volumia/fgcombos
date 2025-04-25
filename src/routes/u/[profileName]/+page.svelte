<script lang="ts">
    import { _ } from 'svelte-i18n';
    import Avatar from '@/lib/components/Avatar.svelte';
    import type { PageData } from './$types';
    import ComboCard from '@/routes/(home)/ComboCard.svelte';
    import { profileNameOrDefault } from '@/lib/util/text';
    import ProfileInfoPanel from './ProfileInfoPanel.svelte';
    import ProfileEditorPanel from './ProfileEditorPanel.svelte';
    import { getProfileContext } from '@/lib/state/profileContext';
    import { getFullAvatarUrlOrDefault } from '@/lib/util/user';
    import { Status, type StatusMessage } from '@/lib/util/statusMessage';

    let { data }: { data: PageData } = $props();

    let localProfile = getProfileContext();
    let editing = $state(false);
    let hasEditPermissions = $derived(
        localProfile != null && data.pageProfile.id === localProfile.id
    );

    function startEditing() {
        editing = true;
    }

    function stopEditing() {
        editing = false;
    }
</script>

<main class="page">
    <div class="primary-area">
        <Avatar
            src={getFullAvatarUrlOrDefault(data.pageProfile.avatar_url)}
            className="avatar-override"
        ></Avatar>

        {#if editing && localProfile != null}
            <ProfileEditorPanel
                uid={localProfile.id}
                initDescription={localProfile.description}
                supabase={data.supabase}
                close={stopEditing}
            ></ProfileEditorPanel>
        {/if}

        {#if !editing}
            {#if localProfile != null && localProfile.id === data.pageProfile.id}
                <ProfileInfoPanel
                    profileName={localProfile.profile_name}
                    description={localProfile.description}
                    showEditButton={hasEditPermissions}
                    {startEditing}
                ></ProfileInfoPanel>
            {:else}
                <ProfileInfoPanel
                    profileName={data.pageProfile.profile_name}
                    description={data.pageProfile.description}
                    showEditButton={hasEditPermissions}
                    {startEditing}
                ></ProfileInfoPanel>
            {/if}
        {/if}
    </div>
    <div class="secondary-area">
        <h3>{$_('common.combos')}</h3>
        {#if data.combos != null}
            {#each data.combos as combo}
                <ComboCard
                    id={combo.url_id}
                    title={combo.title}
                    totalDamage={combo.damage}
                    gameId={combo.game_name ?? ''}
                    characterId={combo.character_name ?? ''}
                    likes={combo.like_count}
                    userName={profileNameOrDefault(combo.creator_profile_name)}
                ></ComboCard>
            {/each}
        {/if}
    </div>
</main>

<style lang="scss">
    @use '@/style/variables' as *;
    @use '@/style/mixins' as *;
    .page {
        display: grid;
        grid-template: 'a b' auto / 20% 80%;
        gap: $spacing-8;
        margin-top: $spacing-4;
        padding: 0 $spacing-32;

        @include for-size(phone, down) {
            grid-template:
                'a' auto
                'b' auto / 100%;

            gap: $spacing-4;
            padding: $spacing-2;
        }
    }

    .primary-area {
        grid-area: a;
    }

    .secondary-area {
        grid-area: b;
    }

    .page :global(.avatar-override) {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1/1 !important;
        border: 3px solid $clr-mono20 !important;
    }

    .msg-error {
        font-size: $text-sm;
        color: $clr-red70;
        margin: $spacing-2 0;
    }

    .msg-success {
        font-size: $text-sm;
        color: $clr-green70;
        margin: $spacing-2 0;
    }
</style>
