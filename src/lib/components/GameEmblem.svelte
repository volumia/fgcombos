<script lang="ts">
    import { _ } from 'svelte-i18n';
    import Icon from './Icon.svelte';
    import { IconSrcType } from './IconSrcType';

    type Props = {
        gameId: string;
    };

    let { gameId }: Props = $props();
</script>

<Icon
    srcType={IconSrcType.Image}
    src={`/images/games/${gameId}/emblem.png`}
    title={$_(`games.${gameId}.name`)}
></Icon>
