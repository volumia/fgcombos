<script lang="ts">
    import { IconSrcType } from "./IconSrcType";
    
    type Props = {
        src: string;
        srcType?: IconSrcType
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
        src,
        srcType = IconSrcType.Svg,
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

    const sizeValue = $derived(typeof size === 'string' ? size : `${size * 1.5}em`);

    const getStyles = () => {
        const transform = [];
        const styles = [];

        styles.push(['width', sizeValue]);
        styles.push(['height', sizeValue]);

        if (srcType === IconSrcType.Svg) {
            styles.push(['-webkit-mask', `url(${src}) no-repeat center`]);
            styles.push(['mask', `url(${src}) no-repeat center`]);
            styles.push(['background-color', color !== undefined ? color : 'currentColor']);
        }
        else if (srcType === IconSrcType.SvgPath) {
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

{#if srcType === IconSrcType.Svg}
    <div {style} class={className} {title}></div>
{:else if srcType === IconSrcType.SvgPath}
    <svg viewBox="0 0 24 24" {style} class={className}>
        {#if title != undefined}
            <title>{title}</title>
        {/if}
        <path d={src} />
    </svg>
{:else}
    <img {style} class={className} src={src} {title} alt={title} />
{/if}

<style>
    div,
    svg,
    img {
        display: inline-block;
        vertical-align: middle;
    }
</style>
