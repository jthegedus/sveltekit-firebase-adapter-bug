const firebaseAdapter = require("svelte-adapter-firebase");
const pkg = require("./package.json");

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter
		adapter: firebaseAdapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			build: { minify: false },
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {}),
			},
		},
	}
};
