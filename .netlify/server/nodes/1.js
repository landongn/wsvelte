

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.86de4bcb.js","_app/immutable/chunks/scheduler.dcbea5c6.js","_app/immutable/chunks/index.54bf86ca.js","_app/immutable/chunks/singletons.520ba546.js","_app/immutable/chunks/index.3b116a99.js"];
export const stylesheets = [];
export const fonts = [];
