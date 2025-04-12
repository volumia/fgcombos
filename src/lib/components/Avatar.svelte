<script lang="ts">
    import { _ } from 'svelte-i18n';
    import avatarDefaultUrl from '$lib/assets/avatars/default.jpg';

    type Props = {
        src?: string;
        size?: number;
    };

    const { src = avatarDefaultUrl, size = 1.5 }: Props = $props();

    let style = $derived(calculateStyle());

    function calculateStyle(): string {
        let style = '';
        style += `width: ${size}em; height: ${size}em;`;
        return style;
    }
</script>

<img class="avatar" {style} {src} alt={$_('user.avatarAlt')}/>

<style lang="scss">
    @use '@/style/variables' as *;

    .avatar {
        display: inline-block;
        vertical-align: middle;

        border: 1px solid $clr-mono50;
        border-radius: 1000px;
    }
</style>
