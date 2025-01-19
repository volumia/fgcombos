<script lang="ts">
    import GameEmblem from '@/common/components/GameEmblem.svelte';
    import Icon from '@/common/components/Icon.svelte';
    import { IconSrcType } from '@/common/components/IconSrcType';
    import { _ } from 'svelte-i18n';

    type Props = {
        title: string;
        totalDamage: number;
        gameId: string;
        characterId: string;
        likes: number;
        userName: string;
    };

    let { title, totalDamage, gameId, characterId, likes, userName }: Props = $props();
</script>

<a class="card" href="/combo/ryu-sf3ts">
    <div class="area-title">
        <h3>{title}</h3>
    </div>
    <div class="area-damage">
        <div class="dmg-info">
            <p>{$_('home.browseSection.totalDamage')}</p>
            <h3>{totalDamage}</h3>
        </div>
    </div>
    <div class="area-info">
        <span>
            <GameEmblem {gameId}></GameEmblem>
            {$_(`characters.${characterId}.name`)}
        </span>
        <span>{$_(`common.byUser`, { values: { name: userName } })}</span>
        <span>{$_('common.likes', { values: { likes } })}</span>
    </div>
</a>

<style lang="scss">
    @use '@/style/variables' as *;

    .card {
        position: relative;
        display: grid;
        grid-template:
            'm a a b' 0.6fr
            'm c c b' 0.4fr / 0.4fr 0.35fr 0.35fr 0.2fr;

        width: 100%;
        height: $size-10;
        margin: $spacing-2 0;

        border: 1px solid black;
        color: white;
        background:
            url('/images/ryu-sf3ts/slice.png') center left no-repeat,
            linear-gradient(to right, rgb(19, 6, 6), 90%, rgb(192, 192, 192));
        background-size: contain, auto;

        text-decoration: none;

        &:hover {
            outline: 1px solid black;
            -webkit-backdrop-filter: brightness(110%);
            backdrop-filter: brightness(150%);
        }
    }

    .area-title {
        grid-area: a;
        // Center child h3 vertically
        display: flex;
        align-items: center;

        h3 {
            width: 100%;
            text-overflow: ellipsis;
            overflow-x: hidden;
            white-space: nowrap;
        }
    }

    .area-damage {
        grid-area: b;
        // Center child .dmg-box vertically and horizontally
        display: flex;
        justify-content: center;
        align-items: center;

        .dmg-info {
            p {
                width: max-content;
                margin: 0 auto;
                font-size: 0.7em;
            }

            h3 {
                width: max-content;
                margin: -0.25em auto;
                font-size: 2.5em;
            }
        }
    }

    .area-info {
        grid-area: c;
        display: flex;
        flex-direction: row;
        gap: 1ch;
    }
</style>
