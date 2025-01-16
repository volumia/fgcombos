<script lang="ts">
    import type { PageData } from './$types';
    import { _ } from 'svelte-i18n';
    import Icon from '@/common/components/Icon.svelte';
    import type { Move, ComboSnapshot, ComboResult } from '@/moveTypes';
    import SelectMoveModal from './SelectMoveModal.svelte';

    let { data }: { data: PageData } = $props();
    const moveset = data.moveset;
    let moves: Move[] = $state([]);
    let result: ComboResult = $derived(resolveCombo(moves));
    let isSelectModalOpen: boolean = $state(false);
    let isEditingName = $state(false);
    let comboName = $state('Combo name');
    let editedName = $state(comboName);

    function resolveCombo(moves: Move[]): ComboResult {
        let result: ComboResult = {
            snapshots: [],
            totalDamage: 0
        };
        let multiplier = 1;

        moves.forEach((move) => {
            let damage = move.baseDamage * multiplier;
            result.totalDamage += damage;

            result.snapshots.push({
                name: move.notation,
                baseDamage: move.baseDamage,
                proration: move.proration,
                multiplier,
                finalDamage: damage
            });

            multiplier *= move.proration;
        });

        return result;
    }

    function openAddModal() {
        isSelectModalOpen = true;
    }

    function addMove(move: Move) {
        moves.push(move);
        isSelectModalOpen = false;
    }

    function beginNameChange() {
        isEditingName = true;
        editedName = comboName;
    }

    function commitNameChange() {
        isEditingName = false;
        comboName = editedName;
    }

    function commitNameChangeForm(e?: SubmitEvent) {
        if (e) {
            e.preventDefault();
        }

        commitNameChange();
    }

    function cancelNameChange() {
        isEditingName = false;
    }

    function handleKeyDown(e: KeyboardEvent) {
        const isDocumentFocusedOnElement =
            document.activeElement && document.activeElement.nodeName !== 'BODY';
        if (!isDocumentFocusedOnElement && e.code === 'KeyA' && !isSelectModalOpen) {
            isSelectModalOpen = true;
            e.preventDefault();
        }
    }

    function focusElement(el: HTMLElement) {
        el.focus();
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

<section class="summary-area">
    <img
        class="portrait"
        src={`/portraits/${moveset.characterId}.png`}
        alt="Portrait of character"
    />
    <div class="metadata">
        {#if isEditingName}
            <form class="searchForm" onsubmit={commitNameChangeForm}>
                <input
                    type="search"
                    id="editName"
                    name="editName"
                    autocomplete="off"
                    use:focusElement
                    bind:value={editedName}
                />
                <input type="submit" hidden />
            </form>
            <button onclick={commitNameChange}>{$_('common.confirm')}</button>
            <button onclick={cancelNameChange}>{$_('common.cancel')}</button>
        {:else}
            <h1 class="title">
                {comboName}
                <button class="icon-button" onclick={beginNameChange}
                    ><Icon src="/icons/pencil.svg"></Icon></button
                >
            </h1>
        {/if}
        <h2 class="totalDamage">
            {$_('edit.totalDamage', { values: { dmg: Math.trunc(result.totalDamage) } })}
        </h2>
        <div>
            <span class="char-name">{$_(`characters.${moveset.characterId}.name`)} &bull;</span>
            <span class="emblem">3rd</span>
        </div>
    </div>
</section>

<table data-testid="move-table">
    <thead>
        <tr>
            <th class="col-move">{$_('edit.colHead.move')}</th>
            <th class="col-baseDamage">{$_('edit.colHead.baseDamage')}</th>
            <th class="col-multiplier">{$_('edit.colHead.multiplier')}</th>
            <th class="col-proration">{$_('edit.colHead.proration')}</th>
            <th class="col-finalDamage">{$_('edit.colHead.finalDamage')}</th>
            <th class="col-delete"></th>
        </tr>
    </thead>
    <tbody>
        {#each result.snapshots as snap, i}
            <tr data-testid="move-row">
                <td>{snap.name}</td>
                <td>{snap.baseDamage}</td>
                <td>{Math.trunc(snap.multiplier * 100)}%</td>
                <td>{Math.trunc(snap.proration * 100)}%</td>
                <td>{Math.trunc(snap.finalDamage)}</td>
                <td
                    ><button onclick={() => moves.splice(i, 1)}
                        ><Icon src="/icons/close.svg"></Icon></button
                    ></td
                >
            </tr>
        {/each}
    </tbody>
</table>

<div class="table-totalDamage">
    {$_('edit.totalDamage', { values: { dmg: Math.trunc(result.totalDamage) } })}
</div>

{#if isSelectModalOpen}
    <SelectMoveModal
        moveList={moveset.moves}
        onConfirm={addMove}
        onCancel={() => (isSelectModalOpen = false)}
    ></SelectMoveModal>
{:else}
    <button onclick={openAddModal} data-testid="open-add-modal">+ {$_('edit.addMove')}</button>
{/if}

<style lang="scss">
    @use '@/style/variables' as *;

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
        margin: $spacing-8 0;

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
    }

    table {
        width: 100%;
        border-collapse: collapse;

        button {
            margin-left: auto;
            margin-right: auto;
            display: block;
            width: 100%;
        }
    }

    table,
    th,
    td {
        border: 1px solid black;
    }

    th,
    td {
        padding: $spacing-2;
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
