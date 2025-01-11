<script lang="ts">
    import { SvelteMap } from "svelte/reactivity";
    import { _ } from "svelte-i18n";
    import Fuse from "fuse.js";
    import type { Move } from "@/moveTypes";
    import Icon from "@/common/components/Icon.svelte";

    type Props = {
        moveList: Move[];
        onConfirm: (move: Move) => void;
        onCancel: () => void;
    };
    let { moveList, onConfirm, onCancel }: Props = $props();

    let searchQuery: string = $state("");
    const fuse = new Fuse(moveList, {
        threshold: 0.2,
        keys: ["name", "notation"]
    });
    let filteredMoves: Move[] = $derived(getFilteredMoves(searchQuery));
    let selectedMoveIndex = $state(0);
    let isSearchEmpty = $derived(searchQuery.trim() === "");
    let moveListElement: Element | undefined = $state(undefined);
    let headers = $state(new SvelteMap<string, string|undefined>());

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

        if (filteredMoves.length > 0) {
            onConfirm(filteredMoves[selectedMoveIndex]);
        }
    }

    function onModalKeyPress(e: KeyboardEvent) {
        if (e.code === "ArrowUp") {
            selectedMoveIndex--;
            e.preventDefault();
        }
        if (e.code === "ArrowDown") {
            selectedMoveIndex++;
            e.preventDefault();
        }
        if (e.code === "Escape") {
            onCancel();
        }
        if (selectedMoveIndex >= filteredMoves.length) {
            selectedMoveIndex = filteredMoves.length - 1;
        }
        if (selectedMoveIndex < 0) {
            selectedMoveIndex = 0;
        }
    }

    function focusElement(el: HTMLElement) {
        el.focus();
    }

    $effect(() => {
        filteredMoves; // Re-run this effect when filteredMoves updates
        selectedMoveIndex = 0; // Select the first move in the list.
        
        headers.clear();
        const alreadyFound: string[] = [];
        filteredMoves.forEach(move => {
            if (!alreadyFound.includes(move.category)) {
                headers.set(move.notation, move.category);
                alreadyFound.push(move.category);
            }
        });
    });

    // Scroll the selected (not the same as page focus) move into view when navigating with arrow keys.
    $effect(() => {
        if (moveListElement) {
            const moveEls = moveListElement.querySelectorAll(".move");
            const moveEl = moveEls[selectedMoveIndex];
            if (moveEl) {
                moveEl.scrollIntoView({block: "nearest"});
            }
        }
    });
</script>

<div class="modal">
    <div onkeydown={onModalKeyPress} role="presentation">
        <div class="toolbar">
            <form class="searchForm" onsubmit={onSearchSubmit}>
                <input
                    type="search"
                    id="search"
                    name="search"
                    placeholder={$_("edit.searchPlaceholder")}
                    autocomplete="off"
                    use:focusElement
                    bind:value={searchQuery}
                />
                <input type="submit" hidden />
            </form>
            <button class="cancel" onclick={onCancel}><Icon src="/icons/close.svg" /></button>
        </div>
        <div class="move-list" bind:this={moveListElement}>
            {#each filteredMoves as move, i (move.notation)}
                {#if headers.has(move.notation)}
                    <h3>{$_(`edit.moveTypes.${headers.get(move.notation) as string}`)}</h3>
                {/if}
                <button
                    class={i == selectedMoveIndex ? "move selected" : "move"}
                    onclick={() => onConfirm(move)}
                    data-testid="add-move"
                >
                    <div class="line">
                        <div>{move.notation}</div>
                        <div class="name">{move.name}</div>
                        <div class="filler"></div>
                        <div class="damage">
                            <Icon src={"/icons/fist.svg"} />
                            {move.baseDamage}
                        </div>
                        <div class="proration">
                            <Icon src={"/icons/trend-down.svg"} />
                            {move.proration * 100}%
                        </div>
                    </div>
                </button>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    @use "@/style/variables" as *;

    button {
        margin: $spacing-1 0;
        padding: $spacing-1;
        font-size: 1em;
    }
    
    .modal {
        position: absolute;
        max-width: 400px;
        padding: $spacing-1;

        font-size: 1em;

        border: 1px solid black;
        background-color: gray;
    }

    .toolbar {
        display: flex;
        width: 100%;
        height: 2em;
        align-items: center;

        .cancel {
            height: 100%;
            aspect-ratio: 1/1;
        }

        .searchForm {
            height: 100%;
            flex-grow: 1;

            input {
                width: 100%;
                height: 100%;
            }
        }
    }

    .move-list {
        max-height: 200px;
        overflow-y: scroll;
    }

    button.move {
        display: block;

        width: 100%;
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
