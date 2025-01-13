<script lang="ts">
    import { _ } from "svelte-i18n";
    import { goto } from "$app/navigation";
    import Dropdown from "@/lib/components/Dropdown.svelte";
    import rawGamesData from "@/data/games.json";
    import ComboCard from "./ComboCard.svelte";

    type CharacterData = {
        id: string;
    };

    type GameData = {
        title: string;
        characters: CharacterData[];
    };

    type GamesDataType = {
        games: GameData[];
    };

    let gamesData = rawGamesData as GamesDataType;

    let selectedGame: GameData | undefined = $state();
    let selectedCharacter: CharacterData | undefined = $state();

    let gameOptions: { value: GameData; text: string }[] = gamesData.games.map((g) => {
        return { value: g, text: g.title };
    });

    let characterOptions: { value: CharacterData; text: string }[] = $derived(
        selectedGame != undefined
            ? selectedGame.characters.map((c) => ({ value: c, text: `characters.${c.id}.name` }))
            : []
    );

    let canCreateCombo: boolean = $derived(
        selectedGame != undefined && selectedCharacter != undefined
    );

    function goToEditPage() {
        if (selectedCharacter) {
            goto(`/combo/${selectedCharacter?.id}`);
        }
    }
</script>

<div class="division">
    <section class="create-form">
        <h2>{$_("home.createSection.title")}</h2>

        <label for="select-game">{$_("home.createSection.selectGameLabel")}</label>
        <Dropdown
            options={gameOptions}
            bind:value={selectedGame}
            placeholder={$_("home.createSection.selectGamePlaceholder")}
        ></Dropdown>

        <label for="select-character">{$_("home.createSection.selectCharacterLabel")}</label>
        <Dropdown
            options={characterOptions}
            bind:value={selectedCharacter}
            disabled={characterOptions.length === 0}
            placeholder={$_("home.createSection.selectCharacterPlaceholder")}
        ></Dropdown>

        <button onclick={goToEditPage} disabled={!canCreateCombo}>{$_("common.create")}</button>
    </section>
    <section class="browse">
        <h2>{$_("home.browseSection.title")}</h2>
        <ComboCard
            title="Easy bread n butter bread n butter"
            totalDamage={451}
            gameId="sf3ts"
            characterId="ryu-sf3ts"
            likes={98}
            userName="Gyro"
        ></ComboCard>
        <ComboCard
            title="Easy bread n butter"
            totalDamage={451}
            gameId="sf3ts"
            characterId="ryu-sf3ts"
            likes={98}
            userName="Gyro"
        ></ComboCard>
        <ComboCard
            title="Easy bread n butter"
            totalDamage={451}
            gameId="sf3ts"
            characterId="ryu-sf3ts"
            likes={98}
            userName="Gyro"
        ></ComboCard>
        <ComboCard
            title="Easy bread n butter"
            totalDamage={451}
            gameId="sf3ts"
            characterId="ryu-sf3ts"
            likes={98}
            userName="Gyro"
        ></ComboCard>
        <ComboCard
            title="Easy bread n butter"
            totalDamage={451}
            gameId="sf3ts"
            characterId="ryu-sf3ts"
            likes={98}
            userName="Gyro"
        ></ComboCard>
    </section>
</div>

<style lang="scss">
    @use "@/style/mixins" as *;

    .division {
        display: grid;
        grid-template: "a b" auto / 0.55fr 0.45fr;

        @include for-size(phone, down) {
            grid-template: 
                "a" auto
                "b" auto / 1fr;
        }
    }

    .create-form {
        grid-area: a;
    }

    .browse {
        grid-area: b;
    }
</style>
