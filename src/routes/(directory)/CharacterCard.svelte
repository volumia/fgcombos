<script lang="ts">
    import { _ } from "svelte-i18n";
    
    type Props = {
        characterId: string
    }

    let { characterId }: Props = $props();
</script>

<div class="card">
    <a class="link-box" href={`/combo/${characterId}`}>
        <img class="card-image" src={`/images/${characterId}/card.png`} alt="Character portrait" />
        <p class="name">{$_(`characters.${characterId}.name`)}</p>
    </a>
</div>

<style lang="scss">
    .card {
        width: 225px;
    }

    .card-image {
        height: 300px;
        object-fit: cover;
    }

    .name {
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }

    .link-box {
        display: block;
        width: 100%;
        height: 100%;
    }
</style>