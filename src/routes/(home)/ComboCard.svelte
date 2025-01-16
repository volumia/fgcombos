<script lang="ts">
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
        <h3>{$_('common.damageNumber', { values: { dmg: totalDamage } })}</h3>
    </div>
    <div class="area-info">
        <span>{$_(`games.${gameId}.abbrev`)} &bull; {$_(`characters.${characterId}.name`)}</span>
        <span>{$_(`common.byUser`, { values: { name: userName } })}</span>
        <span>{$_('common.likes', { values: { likes } })}</span>
    </div>
</a>

<style lang="scss">
    @use '@/style/variables' as *;

    .card {
        display: grid;
        grid-template:
            'm a a b' 0.6fr
            'm c c c' 0.4fr / 0.4fr 0.3fr 0.3fr 0.3fr;

        width: 100%;
        height: 80px;
        margin: $margin-2 0;

        border: 1px solid black;
        color: white;
        background:
            url('/images/ryu-sf3ts/slice.png') center left no-repeat,
            linear-gradient(to right, rgb(15, 7, 5), 90%, rgba(15, 7, 5, 0%));
        background-size: contain, auto;

        text-decoration: none;
    }

    .link-box {
        display: block;
        width: 100%;
        height: 100%;
    }

    .area-title {
        grid-area: a;
    }

    .area-damage {
        grid-area: b;
    }

    .area-info {
        grid-area: c;
        display: flex;
        flex-direction: row;
        gap: 1ch;
    }
</style>
