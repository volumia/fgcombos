<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { goto } from '$app/navigation';
    import Dropdown from '@/lib/components/Dropdown.svelte';
    import ComboCard from './ComboCard.svelte';
    import type { PageData } from './$types';
    import { createCombo } from '@/lib/supabase/functions';
    import type { DBGame, DBCharacter, DBCombo } from '@/lib/supabase/databaseTypes';

    let { data }: { data: PageData } = $props();

    let selectedGame: DBGame | undefined = $state();
    let selectedCharacter: DBCharacter | undefined = $state();

    let gameOptions: { value: DBGame; text: string }[] = data.games.map((g) => {
        return { value: g, text: `games.${g.name}.name` };
    });

    let characterOptions: { value: DBCharacter; text: string }[] = $state([]);
    let abortGetCharacters: AbortController = new AbortController();

    let createComboPromise: Promise<DBCombo | undefined> | undefined = $state();
    let waitingForComboCreation: boolean = $state(false);

    $effect(() => {
        if (selectedGame != undefined) {
            abortGetCharacters.abort();
            abortGetCharacters = new AbortController();

            const getCharactersPromise = data.supabase
                .from('characters')
                .select()
                .eq('game_name', selectedGame.name)
                .abortSignal(abortGetCharacters.signal);

            getCharactersPromise.then(({ data }) => {
                if (data != undefined) {
                    characterOptions = data.map((v) => ({
                        value: v,
                        text: `characters.${v.name}.name`
                    }));
                }
            });
        }
    });

    let canCreateCombo: boolean = $derived(
        selectedGame != undefined && selectedCharacter != undefined
    );

    async function createComboWithSettings() {
        if (selectedGame && selectedCharacter) {
            if (!createComboPromise) {
                createComboPromise = createCombo(selectedGame.name, selectedCharacter.name);
                waitingForComboCreation = true;

                const combo = await createComboPromise;
                if (combo) {
                    await goto(`/combo/${combo.id}`);
                }

                createComboPromise = undefined;
                waitingForComboCreation = false;
            }
        }
    }
</script>

<div class="division">
    <section class="create-form">
        <h2>{$_('home.createSection.title')}</h2>

        <label for="select-game">{$_('home.createSection.selectGameLabel')}</label>
        <Dropdown
            options={gameOptions}
            bind:value={selectedGame}
            placeholder={$_('home.createSection.selectGamePlaceholder')}
        ></Dropdown>

        <label for="select-character">{$_('home.createSection.selectCharacterLabel')}</label>
        <Dropdown
            options={characterOptions}
            bind:value={selectedCharacter}
            disabled={characterOptions.length === 0}
            placeholder={$_('home.createSection.selectCharacterPlaceholder')}
        ></Dropdown>

        {#if waitingForComboCreation}
            <button onclick={createComboWithSettings} disabled>
                {$_('common.pending')}
            </button>
        {:else}
            <button onclick={createComboWithSettings} disabled={!canCreateCombo}>
                {$_('common.create')}
            </button>
        {/if}
    </section>
    <section class="browse">
        <h2>{$_('home.browseSection.title')}</h2>
        {#each data.combos as combo}
            <ComboCard
                id={combo.id}
                title={combo.title}
                totalDamage={combo.damage}
                gameId={combo.game_name ?? ''}
                characterId={combo.character_name ?? ''}
                likes={combo.like_count}
                userName="Gyro"
            ></ComboCard>
        {/each}
    </section>
</div>

<style lang="scss">
    @use '@/style/mixins' as *;

    .division {
        display: grid;
        grid-template: 'a b' auto / 0.3fr 0.7fr;

        @include for-size(phone, down) {
            grid-template:
                'a' auto
                'b' auto / 1fr;
        }
    }

    .create-form {
        grid-area: a;
    }

    .browse {
        grid-area: b;
    }
</style>
