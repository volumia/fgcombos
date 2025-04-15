<script lang="ts">
    import { _ } from 'svelte-i18n';
    import avatarDefaultUrl from '$lib/assets/avatars/default.jpg';
    import clsx from 'clsx';

    type Props = {
        src?: string;
        size?: number;
        className?: string;
    };

    const { src = avatarDefaultUrl, size = 1.5, className }: Props = $props();

    let style = $derived(calculateStyle());

    function calculateStyle(): string {
        let style = '';
        style += `width: ${size}em; height: ${size}em;`;
        return style;
    }
</script>

<img {style} {src} class={clsx('avatar', className)} alt={$_('user.avatarAlt')}/>

<style lang="scss">
    @use '@/style/variables' as *;

    .avatar {
        display: inline-block;
        vertical-align: middle;

        border: 1px solid $clr-mono50;
        border-radius: 1000px;
    }
</style>
