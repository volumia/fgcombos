<script lang="ts">
    import '@/style/app.scss';
    import { onMount } from 'svelte';
    import { invalidate } from '$app/navigation';
    import Header from '@/lib/components/Header.svelte';

    let { data, children } = $props();
    let { session, supabase } = $derived(data);

    onMount(() => {
        // Indicates to tests that SvelteKit has finished hydrating
        document.body.setAttribute('hydrated', '');

        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth');
            }
        });

        return () => data.subscription.unsubscribe();
    });
</script>

<Header user={data.user}></Header>

{@render children()}
