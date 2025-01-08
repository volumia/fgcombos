<script lang="ts">
    import "@/style/app.scss";
    import { onMount } from "svelte";
    
    let { children } = $props();

    onMount(() => {
        // Indicates to tests that SvelteKit has finished hydrating
        document.body.setAttribute("hydrated", "");
    });
</script>

{@render children()}