<script lang="ts">
    import type { PageData } from './$types';
    import { _, locale, addMessages } from 'svelte-i18n';
    import Icon from '@/common/components/Icon.svelte';
    import type { Move, ComboSnapshot, ComboResult } from '@/moveTypes';
    import SelectMoveModal from './SelectMoveModal.svelte';
    import GameEmblem from '@/common/components/GameEmblem.svelte';
    import { RevertableValue } from '@/lib/util/revertableValue.svelte';
    import { resolveCombo } from '@/lib/games/sf3ts/calc';
    import clsx from 'clsx';
    import { SvelteMap } from 'svelte/reactivity';
    import type { PostgrestError } from '@supabase/supabase-js';

    enum UpdateStatus {
        NotSent,
        Sending,
        Failed,
        Sent
    }

    let { data }: { data: PageData } = $props();

    const moveset = data.moveset;
    const cid = data.characterId;
    if ($locale) {
        addMessages($locale, data.localeDict);
    }

    let idToMoveMap: SvelteMap<string, Move> = createMapFromMoves(data.moveset.moves);
    let moves = $state(
        new RevertableValue<Move[]>(data.combo.move_ids ? moveIdsToMoves(data.combo.move_ids) : [])
    );
    let namedMoveset = $derived(createNamedMoves(moveset.moves));
    let result: ComboResult = $derived(resolveCombo(moves.value));

    let comboTitle = new RevertableValue<string>(data.combo.title);
    let isSelectModalOpen: boolean = $state(false);

    let inEditMode: boolean = $state(false);
    let isEditing = $derived(data.hasEditPermissions && inEditMode);

    let updateStatus = $state(UpdateStatus.NotSent);

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
        comboTitle.beginEdit();
        moves.beginEdit([...moves.value]);
    }

    function cancelEdits() {
        inEditMode = false;
        comboTitle.revert();
        moves.revert();
    }

    async function confirmEdits() {
        inEditMode = false;
        comboTitle.confirm();
        moves.confirm();

        updateStatus = UpdateStatus.Sending;
        const moveIds = movesToMoveIds(moves.value);
        const { error, status } = await data.supabase
            .from('combos')
            .update({
                title: comboTitle.value,
                move_ids: moveIds,
                damage: result.totalDamage
            })
            .eq('id', data.combo.id);

        if (error) {
            updateStatus = UpdateStatus.Failed;
        } else {
            updateStatus = UpdateStatus.Sent;
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
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if updateStatus === UpdateStatus.Sending}
    <h3>{$_('edit.publishing')}</h3>
{:else if updateStatus === UpdateStatus.Sent}
    <h3>{$_('edit.publishedSuccess')}</h3>
{:else if updateStatus === UpdateStatus.Failed}
    <h3>{$_('edit.publishedFail')}</h3>
{/if}

{#if data.hasEditPermissions}
     <div class="mode-area">
         {#if isEditing}
             <div class="mode-indicator">{$_('edit.editing')}</div>
             <button onclick={confirmEdits}>{$_('common.confirm')}</button>
             <button onclick={cancelEdits}>{$_('common.cancel')}</button>
         {:else}
             <div class="mode-indicator">{$_('edit.viewing')}</div>
             <button onclick={enterEditMode}>{$_('common.edit')}</button>
         {/if}
     </div>
{/if}

<section class="summary-area">
    <img class="portrait" src={`/portraits/${data.characterId}.png`} alt="Portrait of character" />
    <div class="metadata">
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
        <h2 class="totalDamage">
            {$_('edit.totalDamage', { values: { dmg: Math.trunc(result.totalDamage) } })}
        </h2>
        <div>
            <GameEmblem gameId={data.gameId ?? ''}></GameEmblem>
            <span class="char-name">{$_(`characters.${data.characterId}.name`)}</span>
        </div>
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

    .mode-area {
        vertical-align: middle;

        .mode-indicator {
            display: inline-block;
            width: $size-12;
            height: 2em;

            background-color: rgb(255, 255, 255);
            border: 1px solid black;
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

        .portrait {
            display: block;
            height: 25em;
            aspect-ratio: 1/1.5;
            object-fit: cover;
        }

        .metadata {
            width: auto;
            font-size: 1.5em;

            h1.title {
                font-size: 2em;
                vertical-align: middle;
            }

            h2.totalDamage {
                font-size: 1.25em;
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
            color: rgb(73, 73, 73);
        }
    }

    table,
    th,
    td {
        border: 1px solid black;
    }

    th,
    td {
        padding: $spacing-1;
        height: 2.5em;
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
