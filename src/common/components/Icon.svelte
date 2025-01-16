<script lang="ts">
    type Props = {
        path?: string;
        src?: string;
        size?: number | string;
        color?: string;
        flip?: string;
        rotate?: number;
        marginBottom?: number;
        marginRight?: number;
        title?: string | undefined;
        className?: string;
    };

    let {
        path = undefined,
        src = undefined,
        size = 1,
        color = undefined,
        flip = undefined,
        rotate = 0,
        marginBottom = 0,
        marginRight = 0,
        title = undefined,
        className = ''
    }: Props = $props();

    if (Number(size)) size = Number(size);

    const fromFile = typeof src === 'string';
    const width = $derived(typeof size === 'string' ? size : `${size * 1.5}em`);

    const getStyles = () => {
        const transform = [];
        const styles = [];

        styles.push(['width', width]);
        styles.push(['height', width]);

        if (fromFile) {
            styles.push(['-webkit-mask', `url(${src}) no-repeat center`]);
            styles.push(['mask', `url(${src}) no-repeat center`]);
            styles.push(['background-color', color !== undefined ? color : 'currentColor']);
            styles.push(['display', 'inline-block']);
            styles.push(['vertical-align', 'middle']);
        } else {
            styles.push(['fill', color !== undefined ? color : 'currentColor']);
        }

        if (flip === 'h') {
            transform.push('scaleX(-1)');
        }
        if (flip === 'v') {
            transform.push('scaleY(-1)');
        }
        if (rotate != 0) {
            transform.push(`rotate(${rotate}deg)`);
        }
        if (transform.length > 0) {
            styles.push(['transform', transform.join(' ')]);
            styles.push(['transform-origin', 'center']);
        }
        if (marginBottom > 0) {
            styles.push(['margin-bottom', `${marginBottom}em`]);
        }
        if (marginRight > 0) {
            styles.push(['margin-right', `${marginRight}em`]);
        }
        return styles.reduce((cur, item) => {
            return `${cur} ${item[0]}:${item[1]};`;
        }, '');
    };

    let style: string = $derived(getStyles());
</script>

{#if src != undefined}
    <div {style} class={className}></div>
{:else}
    <svg viewBox="0 0 24 24" {style} class={className}>
        {#if title != undefined}
            <title>{title}</title>
        {/if}
        <path d={path} />
    </svg>
{/if}

<style>
    svg {
        vertical-align: middle;
        display: inline-block;
    }
</style>
