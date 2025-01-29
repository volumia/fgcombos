<script lang="ts">
    import '@/style/app.scss';
    import { onMount } from 'svelte';
    import { invalidate } from '$app/navigation';
    import Header from '@/lib/components/Header.svelte';
    import { userState } from '@/lib/supabase/store.svelte';

    let { data, children } = $props();
    let { session, supabase } = $derived(data);

    onMount(() => {
        // Indicates to tests that SvelteKit has finished hydrating
        document.body.setAttribute('hydrated', '');

        userState.user = data.user;
        userState.session = data.session;
        userState.supabase = data.supabase;

        const { data: authData } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth');
            }
        });

        return () => authData.subscription.unsubscribe();
    });
</script>

<Header user={data.user} supabase={data.supabase}></Header>

{@render children()}
