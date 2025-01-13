<script lang="ts">
    let { children } = $props();
</script>

<div class="narrow">
    {@render children()}
</div>

<style lang="scss">
    .narrow {
        max-width: 60em;
        margin: 0 auto;
    }
</style>
