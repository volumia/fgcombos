<script lang="ts">
    import { _ } from "svelte-i18n";
    import Icon from "@/common/components/Icon.svelte";
    import type { Move, ComboSnapshot, ComboResult } from "@/moveTypes";
    import SelectMoveModal from "./SelectMoveModal.svelte";
    import { moveset } from "@/data/moveset";
    
    let moves: Move[] = $state([]);
    let result: ComboResult = $derived(resolveCombo(moves));
    let isSelectModalOpen: boolean = $state(false);

    function resolveCombo(moves: Move[]): ComboResult {
        let result: ComboResult = {
            snapshots: [],
            totalDamage: 0,
        };
        let multiplier = 1;
        
        moves.forEach(move => {
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

    function handleKeyDown(e: KeyboardEvent) {
        if (e.code === "KeyA" && !isSelectModalOpen) {
            isSelectModalOpen = true;
            e.preventDefault();
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

<h1>{$_(`characters.${moveset.characterId}.name`)}</h1>

<table>
    <thead>
        <tr>
            <th>{$_("edit.colHead.move")}</th>
            <th>{$_("edit.colHead.baseDamage")}</th>
            <th>{$_("edit.colHead.multiplier")}</th>
            <th>{$_("edit.colHead.proration")}</th>
            <th>{$_("edit.colHead.finalDamage")}</th>
            <th class="deleteButtonsColumn"></th>
        </tr>
    </thead>
    <tbody>
        {#each result.snapshots as snap, i}
            <tr>
                <td>{snap.name}</td>
                <td>{snap.baseDamage}</td>
                <td>{Math.trunc(snap.multiplier * 100)}%</td>
                <td>{Math.trunc(snap.proration * 100)}%</td>
                <td>{Math.trunc(snap.finalDamage)}</td>
                <td><button onclick={() => moves.splice(i, 1)}><Icon src="./icons/close.svg"></Icon></button></td>
            </tr>
        {/each}
    </tbody>
</table>

{#if isSelectModalOpen}
    <SelectMoveModal
        moveList={moveset.moves}
        onConfirm={addMove}
        onCancel={() => isSelectModalOpen = false}
    >
    </SelectMoveModal>
{:else}
    <button onclick={openAddModal}>+ {$_("edit.addMove")}</button>
{/if}

<div>{$_("edit.totalDamage")} {Math.trunc(result.totalDamage)}</div>

<style lang="scss">
    @use "@/style/variables" as *;
    
    table {
        border-collapse: collapse;
        
        button {
            margin-left: auto;
            margin-right: auto;
            display: block;
            width: 100%;
        }
    }
    
    table, th, td {
        border: 1px solid black;
    }

    th, td {
        padding: $spacing-2;
    }

    .deleteButtonsColumn {
        width: 5ch;
    }
</style>