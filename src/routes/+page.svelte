<script lang="ts">
    import type { Move, ComboSnapshot, ComboResult } from "@/moveTypes";
    import SelectMoveModal from "./SelectMoveModal.svelte";
    import { moveset } from "@/data/moveset";
    
    let moves: Move[] = $state([]);
    let result: ComboResult = $derived(resolveCombo(moves));
    let isSelectingMove: boolean = $state(false);

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
        isSelectingMove = true;
    }

    function addMove(move: Move) {
        moves.push(move);
        isSelectingMove = false;
    }
</script>

<table>
    <thead>
        <tr>
            <th>Move</th>
            <th>Base damage</th>
            <th>Multiplier</th>
            <th>Proration</th>
            <th>Final damage</th>
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
            </tr>
        {/each}
    </tbody>
</table>

{#if isSelectingMove}
    <SelectMoveModal
        moveset={moveset}
        onAddMove={addMove}
    >
    </SelectMoveModal>
{:else}
    <button onclick={openAddModal}>+ Add move</button>
{/if}

<div>Total damage: {Math.trunc(result.totalDamage)}</div>

<style>
    table {
        border-collapse: collapse;
    }
    
    table, th, td {
        border: 1px solid black;
    }
</style>