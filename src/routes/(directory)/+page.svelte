<script lang="ts">
    import CharacterCard from "./CharacterCard.svelte";
</script>

<p class="center-horizontally">Choose a character</p>
<p class="center-horizontally">↓</p>
<h1>Street Fighter III - 3rd Strike</h1>
<div class="card-grid">
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
    <CharacterCard characterId="ryu-sf3ts"></CharacterCard>
</div>

<style lang="scss">
    .card-grid {
        display: flex;
        width: 100%;

        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
        gap: 16px;
    }

    .center-horizontally {
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }
</style>