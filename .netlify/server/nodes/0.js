

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.db91891c.js","_app/immutable/chunks/scheduler.dcbea5c6.js","_app/immutable/chunks/index.54bf86ca.js"];
export const stylesheets = [];
export const fonts = [];
