<script lang="ts">
    import type { PageData } from './$types';
    import { _, locale, addMessages } from 'svelte-i18n';
    import Icon from '@/lib/components/Icon.svelte';
    import type { Move, ComboSnapshot, ComboResult } from '@/moveTypes';
    import SelectMoveModal from './SelectMoveModal.svelte';
    import GameEmblem from '@/lib/components/GameEmblem.svelte';
    import { RevertibleValue } from '@/lib/util/revertibleValue.svelte';
    import { resolveCombo } from '@/lib/games/sf3ts/calc';
    import clsx from 'clsx';
    import { SvelteMap } from 'svelte/reactivity';
    import { onMount } from 'svelte';

    let { data }: { data: PageData } = $props();

    const moveset = data.moveset;
    const cid = data.characterId;
    if ($locale) {
        addMessages($locale, data.localeDict);
    }

    let idToMoveMap: SvelteMap<string, Move> = createMapFromMoves(data.moveset.moves);
    let moves = $state(
        new RevertibleValue<Move[]>(data.combo.move_ids ? moveIdsToMoves(data.combo.move_ids) : [])
    );
    let namedMoveset = $derived(createNamedMoves(moveset.moves));
    let result: ComboResult = $derived(resolveCombo(moves.value));

    let comboTitle = new RevertibleValue<string>(data.combo.title);
    let isSelectModalOpen: boolean = $state(false);

    let inEditMode: boolean = $state(false);
    let isEditing = $derived(data.hasEditPermissions && inEditMode);
    let publishStatus: string | undefined = $state();
    let clearPublishStatusTimeoutId: number | undefined = $state();

    function getTranslatedMoveName(id: string) {
        return $_(`characters.${cid}.moves.${id}.name`);
    }

    function getTranslatedMoveNotation(id: string) {
        return $_(`characters.${cid}.moves.${id}.notation`);
    }

    function openAddModal() {
        isSelectModalOpen = true;
    }

    function addMove(move: Move) {
        moves.value.push(move);
        isSelectModalOpen = false;
    }

    function enterEditMode() {
        inEditMode = true;
        publishStatus = undefined;
        comboTitle.beginEdit();
        moves.beginEdit([...moves.value]);
    }

    function cancelEdits() {
        inEditMode = false;
        publishStatus = undefined;
        comboTitle.revert();
        moves.revert();
    }

    async function confirmEdits() {
        inEditMode = false;
        comboTitle.confirm();
        moves.confirm();

        const moveIds = movesToMoveIds(moves.value);
        publishStatus = $_('edit.publishing');

        const { error } = await data.supabase
            .from('combos')
            .update({
                title: comboTitle.value,
                move_ids: moveIds,
                damage: result.totalDamage
            })
            .eq('id', data.combo.id);

        if (error) {
            publishStatus = $_('edit.publishFailure');
        } else {
            publishStatus = $_('edit.publishSuccess');
            clearPublishStatusTimeoutId = window.setTimeout(
                () => (publishStatus = undefined),
                7000
            );
        }
    }

    function createMapFromMoves(moves: Move[]): SvelteMap<string, Move> {
        const map: SvelteMap<string, Move> = new SvelteMap<string, Move>();
        moves.forEach((move) => map.set(move.id, move));
        return map;
    }

    function moveIdsToMoves(ids: string[]): Move[] {
        const moves: Move[] = [];
        ids.forEach((id) => {
            const move = idToMoveMap.get(id);
            if (move == undefined) {
                throw new Error(
                    `Move with id: ${id} should exist but does not exist in id->Move map`
                );
            } else {
                moves.push(move);
            }
        });
        return moves;
    }

    function movesToMoveIds(moves: Move[]): string[] {
        return moves.map((move) => move.id);
    }

    function createNamedMoves(moves: Move[]) {
        return moves.map((move) => {
            return {
                move,
                notation: getTranslatedMoveNotation(move.id),
                name: getTranslatedMoveName(move.id)
            };
        });
    }

    function handleKeyDown(e: KeyboardEvent) {
        const isDocumentFocusedOnElement =
            document.activeElement && document.activeElement.nodeName !== 'BODY';
        if (!isDocumentFocusedOnElement && e.code === 'KeyA' && !isSelectModalOpen && isEditing) {
            isSelectModalOpen = true;
            e.preventDefault();
        }
    }

    onMount(() => {
        return () => {
            if (clearPublishStatusTimeoutId) {
                window.clearTimeout(clearPublishStatusTimeoutId);
            }
        };
    });
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if publishStatus}
    <h3>{publishStatus}</h3>
{/if}

{#if data.hasEditPermissions}
    <div class="mode-area">
        {#if isEditing}
            <div class="mode-indicator">{$_('edit.editing')}</div>
            <button onclick={cancelEdits}>{$_('common.cancel')}</button>
            <button onclick={confirmEdits}>{$_('common.confirm')}</button>
        {:else}
            <div class="mode-indicator">{$_('edit.viewing')}</div>
            <button onclick={enterEditMode}>{$_('common.edit')}</button>
        {/if}
    </div>
{/if}

<section class="summary-area">
    <div class="primary-info panel">
        <img
            class="portrait"
            src={`/portraits/${data.characterId}.png`}
            alt="Portrait of character"
        />
        <div class="metadata">
            <div class="char-name-parent">
                <GameEmblem gameId={data.gameId ?? ''}></GameEmblem>
                <span>{$_(`characters.${data.characterId}.name`)}</span>
            </div>
            {#if isEditing}
                <input
                    type="text"
                    id="editName"
                    name="editName"
                    autocomplete="off"
                    bind:value={comboTitle.value}
                />
            {:else}
                <h1 class="title">
                    {comboTitle.value}
                </h1>
            {/if}
            <div class="user-name-parent">
                <span>{$_(`common.byUser`, { values: { name: '{Placeholder}' } })}</span>
            </div>
        </div>
    </div>

    <div class="secondary-info panel">
        <h3>{$_('home.browseSection.totalDamage')}</h3>
        <h2 class="totalDamage">
            {Math.trunc(result.totalDamage)}
        </h2>
    </div>
</section>

<table class={clsx('move-table', isEditing && 'edit-mode')} data-testid="move-table">
    <thead>
        <tr>
            <th class="col-move">{$_('edit.colHead.move')}</th>
            <th class="col-baseDamage">{$_('edit.colHead.baseDamage')}</th>
            <th class="col-multiplier">{$_('edit.colHead.multiplier')}</th>
            <th class="col-proration">{$_('edit.colHead.proration')}</th>
            <th class="col-finalDamage">{$_('edit.colHead.finalDamage')}</th>
            {#if isEditing}
                <th class="col-delete"></th>
            {/if}
        </tr>
    </thead>
    <tbody>
        {#each result.snapshots as snap, i}
            <tr data-testid="move-row">
                <td>
                    {getTranslatedMoveNotation(snap.id)}
                    <span class="move-name">{getTranslatedMoveName(snap.id)}</span>
                </td>
                <td>{snap.baseDamage}</td>
                <td>{Math.trunc(snap.multiplier * 100)}%</td>
                <td>{Math.trunc(snap.proration * 100)}%</td>
                <td>{Math.trunc(snap.finalDamage)}</td>
                {#if isEditing}
                    <td>
                        <button onclick={() => moves.value.splice(i, 1)}>
                            <Icon src="/icons/close.svg"></Icon>
                        </button>
                    </td>
                {/if}
            </tr>
        {/each}
    </tbody>
</table>

<div class="table-totalDamage">
    {$_('edit.totalDamage', { values: { dmg: Math.trunc(result.totalDamage) } })}
</div>

{#if isEditing}
    {#if isSelectModalOpen}
        <SelectMoveModal
            moves={namedMoveset}
            onConfirm={addMove}
            onCancel={() => (isSelectModalOpen = false)}
        ></SelectMoveModal>
    {:else}
        <button onclick={openAddModal} data-testid="open-add-modal">+ {$_('edit.addMove')}</button>
    {/if}
{/if}

<style lang="scss">
    @use '@/style/variables' as *;

    .panel {
        padding: $spacing-2;

        background-color: $clr-mono10;
        border: 1px solid $clr-mono20;
        border-radius: $rounded-md;
    }

    .mode-area {
        vertical-align: middle;

        .mode-indicator {
            display: inline-block;
            width: $size-12;
            height: 2em;

            background-color: $clr-mono10;
            border: 1px solid $clr-mono20;
            border-radius: 1000px;

            text-align: center;
            vertical-align: middle;
        }
    }

    .icon-button {
        display: inline-flex;
        font-size: 1rem;
        width: 2em;
        height: 2em;
    }

    .summary-area {
        display: flex;
        flex-direction: row;

        width: 100%;
        margin: $spacing-4 0;
        gap: $spacing-2;

        .primary-info {
            display: flex;
            flex-direction: row;
            gap: $spacing-2;

            width: 80%;
        }

        .secondary-info {
            width: 20%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            h3 {
                width: max-content;
                margin: $spacing-2 auto;
                font-size: 1em;
            }

            h2 {
                width: max-content;
                margin: -0.25em auto;
                font-size: 4em;
            }
        }

        .portrait {
            display: block;
            width: $sg * 32;
            height: $sg * 32;
            object-fit: cover;
        }

        .metadata {
            width: auto;
            font-size: 1.5em;

            .char-name-parent {
                font-size: 0.8em;
            }

            h1.title {
                font-size: 2em;
                vertical-align: middle;
                margin: 0;
            }

            h2.totalDamage {
                font-size: 1.25em;
                margin: $spacing-1 0;
            }

            .user-name-parent {
                font-size: 0.8em;
            }
        }

        #editName {
            font-size: 3rem;
            width: 100%;
        }
    }

    table.move-table {
        width: 100%;
        border-collapse: collapse;

        button {
            margin-left: auto;
            margin-right: auto;
            display: block;
            width: 100%;
        }

        .move-name {
            font-size: 0.8em;
            color: $clr-mono80;
        }
    }

    table,
    th,
    td {
        border: 1px solid $clr-mono20;
    }

    th,
    td {
        padding: $spacing-1;
        height: 2.5em;

        background-color: $clr-mono10;
    }

    .col-move {
        width: 30%;
    }

    .col-baseDamage {
        width: 15%;
    }

    .col-multiplier {
        width: 15%;
    }

    .col-proration {
        width: 15%;
    }

    .col-finalDamage {
        width: 20%;
    }

    .col-delete {
        width: 5%;
    }

    .table-totalDamage {
        width: fit-content;
        margin-inline-start: auto;
        margin-inline-end: 0;
    }
</style>
