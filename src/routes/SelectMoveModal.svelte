<script lang="ts">
    import { _ } from "svelte-i18n";
    import Fuse from "fuse.js";
    import type { Move } from "@/moveTypes";
    import type { Action } from "svelte/action";
    import Icon from "@/common/components/Icon.svelte";

    type Props = {
        moveList: Move[];
        onAddMove: (move: Move) => void;
    };
    let { moveList, onAddMove }: Props = $props();

    let searchQuery: string = $state("");
    const fuse = new Fuse(moveList, {
        threshold: 0.2,
        keys: ["name", "notation"]
    });
    let selectableMoves: Move[] = $derived(getFilteredMoves(searchQuery));
    let selectedMoveIndex = $state(0);
    let isSearchEmpty = $derived(searchQuery.trim() === "");

    $effect(() => {
        selectableMoves; // Hack to re-run this effect when selectableMoves updates
        selectedMoveIndex = 0;
    });

    function getFilteredMoves(query: string): Move[] {
        if (isSearchEmpty) {
            return moveList;
        } else {
            const result = fuse.search<Move>(query);
            return result.map((r) => r.item);
        }
    }

    function onSearchSubmit(e: SubmitEvent) {
        e.preventDefault();

        if (selectableMoves.length > 0) {
            onAddMove(selectableMoves[selectedMoveIndex]);
        }
    }

    function onSearchKeyPress(e: KeyboardEvent) {
        if (e.code === "ArrowUp") {
            selectedMoveIndex--;
            e.preventDefault();
        }
        if (e.code === "ArrowDown") {
            selectedMoveIndex++;
            e.preventDefault();
        }
        if (selectedMoveIndex >= selectableMoves.length) {
            selectedMoveIndex = selectableMoves.length - 1;
        }
        if (selectedMoveIndex < 0) {
            selectedMoveIndex = 0;
        }
    }
</script>

<div class="modal">
    <form onsubmit={onSearchSubmit}>
        <input
            type="search"
            id="search"
            name="search"
            placeholder={$_("edit.searchPlaceholder")}
            autocomplete="off"
            autofocus={true}
            onkeydown={onSearchKeyPress}
            bind:value={searchQuery}
        />
        <input type="submit" hidden />
    </form>

    {#each selectableMoves as move, i}
        <button
            class={i == selectedMoveIndex ? "move selected" : "move"}
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
                    {move.proration * 100}%
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
        padding: $spacing-1;
        font-size: 1em;

        text-align: start;

        &.selected {
            border: 2px solid rgb(0, 77, 64);
            background-color: rgb(0, 219, 183);
        }

        .line {
            display: flex;
            flex-direction: row;
            gap: 0.5ch;

            .name {
                font-size: 0.8em;
                color: rgb(73, 73, 73);
            }

            .filler {
                flex-grow: 1;
            }

            .damage,
            .proration {
                min-width: 6ch;
                font-size: 0.8em;
                color: rgb(73, 73, 73);
            }
        }
    }
</style>
