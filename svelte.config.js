import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [vitePreprocess({ script: true })],
    kit: {
        adapter: adapter({
            config: undefined,
            platformProxy: {
                configPath: undefined,
                environment: undefined,
                persist: undefined
            },
            fallback: 'plaintext',
            routes: {
                include: ['/*'],
                exclude: ['<all>']
            }
        }),
        alias: {
            '@/*': './src/*',
            '#/*': './static/*'
        }
    }
};

export default config;
