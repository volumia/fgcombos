<script lang="ts">
    import Fuse from "fuse.js";
	import type { Move, Moveset } from "@/moveTypes";
    import type { Action } from "svelte/action";
    import Icon from "@/common/components/Icon.svelte";

    type Props = {
        moveset: Moveset;
        onAddMove: (move: Move) => void;
    }

    let { moveset, onAddMove }: Props = $props();
    let searchQuery: string = $state("");
    const fuse = new Fuse(moveset.moves, {
        threshold: 0.2,
        keys: ["name", "notation"]
    });
    let selectableMoves: Move[] = $derived(getFilteredMoves(searchQuery));
    let isSearchEmpty = $derived(searchQuery.trim() === "");

    function getFilteredMoves(query: string): Move[] {
        if (isSearchEmpty) {
            return moveset.moves
        }
        else {
            const result = fuse.search<Move>(query);
            return result.map(r => r.item);
        }
    }

    function onSubmitSearch(e: SubmitEvent) {
        e.preventDefault();

        if (!isSearchEmpty && selectableMoves.length > 0) {
            onAddMove(selectableMoves[0]);
        }
    }
</script>

<div class="modal">
    <form onsubmit={onSubmitSearch}>
        <input 
            type="search" 
            id="search" 
            name="search" 
            placeholder="Search moves" 
            autocomplete="off"
            autofocus={true}
            bind:value={searchQuery}
        />
        <input type="submit" hidden />
    </form>

    {#each selectableMoves as move, i}
        <button 
            class={i == 0 && !isSearchEmpty ? "move selected" : "move"}
            onclick={() => onAddMove(move)}
        >
            <div class="line">
                <div>{move.notation}</div>
                <div class="name">{move.name}</div>
                <div class="filler"></div>
                <div class="damage">
                    <Icon src={"./icons/fist.svg"}></Icon> 
                    {move.baseDamage}
                </div>
                <div class="proration">
                    <Icon src={"./icons/trend-down.svg"}></Icon> 
                    {move.proration*100}%
                </div>
            </div>
        </button>
    {/each}
</div>

<style lang="scss">
    @use "@/style/variables" as *;
    .modal {
        width: fit-content;
        padding: $spacing-1;

        font-size: 1em;

        border: 1px solid black;
        background-color: gray;
    }

    #search {
        width: 100%;
        font-size: 1em;
    }

    button.move {
        display: block;
        
        width: 100%;
        margin: $spacing-1 0;
        font-size: 1em;

        text-align: start;

        &.selected {
            outline: 1px solid rgb(0, 219, 183);
        }

        .line {
            display: flex;
            flex-direction: row;
            gap: .5ch;

            .name {
                font-size: .8em;
                color: rgb(73, 73, 73);
            }

            .filler {
                flex-grow: 1;
            }

            .damage, .proration {
                min-width: 6ch;
                font-size: .8em;
                color: rgb(73, 73, 73);
            }
        }
    }

    svg {
        color: inherit;
    }
</style>