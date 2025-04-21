<script lang="ts">
    import { SvelteMap } from 'svelte/reactivity';
    import { _ } from 'svelte-i18n';
    import Fuse from 'fuse.js';
    import type { Move } from '@/moveTypes';
    import Icon from '@/lib/components/Icon.svelte';
    import { Modal } from 'svelte-html-modal';

    // A wrapper on top of Move that includes name and notation.
    // It's necessary to have this data on one type in order to
    // search filter based on these keys.
    type NamedMove = {
        name: string;
        notation: string;
        move: Move;
    };

    type Props = {
        isOpen: boolean;
        moves: NamedMove[];
        onConfirm?: (move: Move) => void;
        onCancel?: () => void;
    };

    let { isOpen = $bindable(false), moves, onConfirm, onCancel }: Props = $props();

    let searchQuery: string = $state('');
    const fuse = new Fuse(moves, {
        threshold: 0.2,
        keys: ['name', 'notation']
    });
    let filteredMoves: NamedMove[] = $derived(getFilteredMoves(searchQuery));
    let selectedMoveIndex = $state(0);
    let isSearchEmpty = $derived(searchQuery.trim() === '');
    let moveListElement: Element | undefined = $state(undefined);
    let sectionHeaders = $state(new SvelteMap<string, string | undefined>());

    function closeAndCancel() {
        isOpen = false;
        onCancel?.();
    }

    function closeAndConfirm() {
        isOpen = false;
        if (filteredMoves.length > 0) {
            onConfirm?.(filteredMoves[selectedMoveIndex].move);
        }
    }

    function getFilteredMoves(query: string): NamedMove[] {
        if (isSearchEmpty) {
            return moves;
        } else {
            const result = fuse.search<NamedMove>(query);
            return result.map((r) => r.item);
        }
    }

    function onModalKeyPress(e: KeyboardEvent) {
        if (e.code === 'ArrowUp') {
            selectedMoveIndex--;
            e.preventDefault();
        }
        if (e.code === 'ArrowDown') {
            selectedMoveIndex++;
            e.preventDefault();
        }
        if (e.code === 'Escape') {
            closeAndCancel();
        }
        if (e.code === 'Enter') {
            closeAndConfirm();
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

    // Reset selection and search state when opening the modal.
    $effect(() => {
        if (isOpen) {
            selectedMoveIndex = 0;
            searchQuery = '';
        }
    });

    // Reset selection state and construct section headers whenever filteredMoves changes.
    $effect(() => {
        selectedMoveIndex = 0; // Select the first move in the list.

        sectionHeaders.clear();
        const alreadyFound: string[] = [];
        filteredMoves.forEach((move) => {
            if (!alreadyFound.includes(move.move.category)) {
                sectionHeaders.set(move.move.id, move.move.category);
                alreadyFound.push(move.move.category);
            }
        });
    });

    // Scroll (not the same as page focus) the selected move into view when navigating with arrow keys.
    $effect(() => {
        if (moveListElement) {
            // Special case for the first move on the list.
            // When scrolling to the first move, scroll the header above it into view instead,
            // as it wouldn't fit into the view otherwise.
            if (selectedMoveIndex === 0) {
                const topMostHeaderEl = moveListElement.querySelector('.section-header');
                if (topMostHeaderEl) {
                    topMostHeaderEl.scrollIntoView({ block: 'nearest' });
                }
            } else {
                const moveEls = moveListElement.querySelectorAll('.move');
                const moveEl = moveEls[selectedMoveIndex];
                if (moveEl) {
                    moveEl.scrollIntoView({ block: 'nearest' });
                }
            }
        }
    });
</script>

<div class="modal-wrapper" onkeydown={onModalKeyPress} role="presentation">
    <Modal bind:isOpen closeOnBackdropClick={true} enableTransitions={false}>
        <div class="content-area">
            <div class="toolbar">
                <input
                    type="search"
                    id="search"
                    name="search"
                    placeholder={$_('edit.searchPlaceholder')}
                    autocomplete="off"
                    use:focusElement
                    bind:value={searchQuery}
                />
            </div>
            {#if filteredMoves.length > 0}
                <div class="move-list" bind:this={moveListElement}>
                    {#each filteredMoves as move, i (move.move.id)}
                        {#if sectionHeaders.has(move.move.id)}
                            <h3 class="section-header">
                                {$_(`edit.moveTypes.${sectionHeaders.get(move.move.id) as string}`)}
                            </h3>
                        {/if}
                        <button
                            class={i == selectedMoveIndex ? 'move selected' : 'move'}
                            onclick={() => onConfirm?.(move.move)}
                            data-testid="add-move"
                        >
                            <div class="row">
                                <div>{move.notation}</div>
                                <div class="name">{move.name}</div>
                                <div class="filler"></div>
                                <div class="damage">
                                    <Icon src={'/icons/fist.svg'} />
                                    {move.move.baseDamage}
                                </div>
                                <div class="proration">
                                    <Icon src={'/icons/trend-down.svg'} />
                                    {move.move.proration * 100}%
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            {:else}
                <h3 class="no-matches">{$_('edit.selectionModal.noMatches')}</h3>
            {/if}
        </div>
        <div class="center-x">
            <p class="hint">{$_('edit.selectionModal.hint1')}</p>
            <p class="hint">{$_('edit.selectionModal.hint2')}</p>
            <p class="hint">{$_('edit.selectionModal.hint3')}</p>
        </div>
    </Modal>
</div>

<style lang="scss">
    @use '@/style/variables' as *;

    $clr-selected: rgb(0, 219, 183);
    $clr-selected-border: rgb(2, 42, 35);

    button {
        margin: $spacing-1 0;
        padding: $spacing-1;
        font-size: 1em;
    }

    .modal-wrapper > :global(dialog) {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        min-width: $size-48;

        font-size: 1em;

        color: $clr-mono90;
        background-color: transparent;
        border: none;
    }

    .modal-wrapper > :global(dialog::backdrop) {
        backdrop-filter: blur(8px) brightness(0.5);
    }

    .content-area {
        padding: $spacing-1;
        margin-bottom: $spacing-4;

        background-color: $clr-mono20;
        border: 1px solid $clr-mono0;
        border-radius: $rounded-md;
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: $spacing-1;

        width: 100%;
        height: 2em;

        .close {
            width: 2em;
            height: 2em;
            border-radius: $rounded-full;
        }

        input {
            width: 100%;
            height: 100%;
            flex-grow: 1;
        }
    }

    .move-list {
        margin: $spacing-4 0;
        max-height: $size-48;
        overflow-y: scroll;
    }

    .section-header {
        color: $clr-mono90;
    }

    .no-matches {
        width: fit-content;
        margin: $spacing-4 auto;
    }

    button.move {
        display: block;

        width: 100%;
        text-align: start;

        background-color: $clr-mono10;
        color: $clr-mono90;

        .row {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5ch;

            .name {
                font-size: 0.8em;
                color: $clr-mono80;
            }

            .filler {
                flex-grow: 1;
            }

            .damage,
            .proration {
                min-width: 6ch;
                font-size: 0.8em;
                color: $clr-mono80;
            }
        }

        &.selected {
            color: $clr-mono0;
            background-color: $clr-selected;
            border-color: $clr-selected-border;
            font-weight: 600;

            .row {
                .name {
                    color: $clr-mono10;
                }

                .damage,
                .proration {
                    color: $clr-mono10;
                }
            }
        }
    }

    .center-x {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hint {
        font-size: 0.8em;
        color: $clr-mono70;
        user-select: none;
    }
</style>
