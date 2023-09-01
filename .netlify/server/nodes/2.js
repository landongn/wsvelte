

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.097e207f.js","_app/immutable/chunks/scheduler.dcbea5c6.js","_app/immutable/chunks/index.54bf86ca.js","_app/immutable/chunks/index.3b116a99.js"];
export const stylesheets = ["_app/immutable/assets/2.056b5783.css"];
export const fonts = [];
