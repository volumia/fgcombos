<script lang="ts">
    import Avatar from '@/lib/components/Avatar.svelte';
    import { _ } from 'svelte-i18n';
    import type { PageData } from './$types';
    import ComboCard from '@/routes/(home)/ComboCard.svelte';
    import { profileNameOrDefault } from '@/lib/util/text';

    let { data }: { data: PageData } = $props();
</script>

<main class="page">
    <div class="primary-area">
        <Avatar className="fill-space"></Avatar>
        <h2>{data.profile.profile_name}</h2>
        <p>{data.profile.description}</p>
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
        padding: $spacing-4 $spacing-32;

        @include for-size(phone, down) {
            grid-template:
                'a' auto
                'b' auto / 100%;

            gap: $spacing-4;
        }
    }

    .primary-area {
        grid-area: a;
    }

    .secondary-area {
        grid-area: b;
    }

    .page :global(.fill-space) {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1/1 !important;
        border: 3px solid $clr-mono20 !important;
    }
</style>
