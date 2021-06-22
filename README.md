# sveltekit-firebase-adapter-bug

This repo is a reproduction of a bug when using SvelteKit with the [svelte-adapter-firebase](https://github.com/jthegedus/svelte-adapter-firebase) adapter.

The bug was identified as caused by this issue - https://github.com/sveltejs/kit/issues/587 It is tracked in the adapter issue list with - https://github.com/jthegedus/svelte-adapter-firebase/issues/22

~This could be a bug with either the adapter (most likely) or SvelteKit. I cannot seem to identify the issue in the adapter itself~

**info:**

```
@sveltejs/kit@1.0.0-next.54
svelte-adapter-firebase@0.5.1
```

```
➜ npx envinfo --system --npmPackages svelte,@sveltejs/kit --binaries --browsers
npx: installed 1 in 1.059s

  System:
    OS: Linux 5.8 Pop!_OS 20.10
    CPU: (8) x64 AMD Ryzen 5 2500U with Radeon Vega Mobile Gfx
    Memory: 4.29 GB / 15.33 GB
    Container: Yes
    Shell: 5.8 - /usr/bin/zsh
  Binaries:
    Node: 14.8.0 - ~/.asdf/installs/nodejs/14.8.0/bin/node
    npm: 6.14.7 - ~/.asdf/installs/nodejs/14.8.0/bin/npm
  Browsers:
    Chrome: 89.0.4389.82
    Firefox: 86.0
  npmPackages:
    @sveltejs/kit: ^1.0.0-next.54 => 1.0.0-next.54
    svelte: ^3.29.0 => 3.35.0
```

## The bug

A second copy of the `_app` dir is created under `.svelte/output/client/` and then copied on build to the adapter output.

Run these commands to observe:

```shell
pnpm install
pnpm run build
# run build a second time
pnpm run build
```

Output after first `pnpm run build`:

```
# .svelte/output/client/_app
assets/
chunks/
pages/
start-#####.js

# functions/svelteAdapterTest
app.mjs
handler.mjs
handler.mjs.map
index.js
style.css

# public
favicon.ico
robots.txt
_app/
	assets/
	chunks/
	pages/
	start-#####.js
```

Output after second `pnpm run build`:

```
# .svelte/output/client/_app
assets/
chunks/
pages/
start-#####.js
_app/**				< erroneous copy (contains assets/ chunks/ pages/ etc)
favicon.ico			< erroneous copy
robots.txt			< erroneous copy

# functions/svelteAdapterTest
app.mjs
handler.mjs
handler.mjs.map
index.js
style.css
robots.txt				< erroneous copy
favicon.ico				< erroneous copy
_app/*					< erroneous copy

# public
_app/
	assets/
	chunks/
	pages/
	start-#####.js
	_app/**					< erroneous copy
	robots.txt				< erroneous copy
	favicon.ico				< erroneous copy
```

For each time `build` command is run, another nested level is created.

## Thoughts

Given a recursive copy of `_app` can be seen in `.svelte/output/client/_app` on each `pnpm run build` it seems to be a bug within SvelteKit itself.

I cannot reproduce with other adapters however. Perhaps it has something to do with `functions/` being in the `.gitignore`?

original thoughts:

~It seems one of `builder.copy_static_files`, `builder.copy_client_files` or `builder.prerender` is the root cause.~

## Testing the adapter

```shell
asdf install
pnpm run install
pnpm run build
pnpm run serve
```
