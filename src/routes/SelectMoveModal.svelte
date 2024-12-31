<script lang="ts">
	import type { Move, Moveset } from "@/moveTypes";

    type Props = {
        moveset: Moveset;
        onAddMove: (move: Move) => void;
    }

    let { moveset, onAddMove }: Props = $props();
</script>

<div class="modal">
    {#each moveset.moves as move }
        <button onclick={() => onAddMove(move)}>{move.name}&nbsp;{move.notation}</button>
    {/each}
</div>

<style lang="scss">
    @use "@/style/variables" as v;
    
    .modal {
        max-width: 200px;
        padding: v.$spacing-1;

        border: 1px solid black;
        background-color: gray;
    }

    button {
        display: block;

        margin: v.$spacing-1;
    }
</style>