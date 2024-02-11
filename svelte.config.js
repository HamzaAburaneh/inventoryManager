import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';

const config = {
    preprocess: sveltePreprocess(), // Setup for preprocessing
    kit: {
        adapter: adapter(), // Specify your adapter here
    },
};

export default config;
